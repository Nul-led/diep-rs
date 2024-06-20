use bevy::{
    app::{App, Plugin}, core::FrameCount, ecs::{query, schedule::ScheduleLabel}, hierarchy::DespawnRecursiveExt, prelude::{Commands, Entity, EventReader, EventWriter, Has, IntoSystemConfigs, Query, Res, With, Without}, utils::intern::Interned
};
use rand::{thread_rng, Rng};

use crate::{
    server::{components::{
        health::{
            AttackCooldownMarker, AttackDamage, AttackDeflection, CriticalAttacks, DefensePower, DespawnMarker, LastDamageTick, Regeneration
        },
        opacity::OpacityModificationConfig, relations::{Owner, Team}, reward::KillReward,
    }, events::{destroy::DestroyEvent, health::{DeathEvent, KillEvent}}},
    shared::{
        components::object::{Health, InvincibilityMarker, Opacity, Score},
        plugins::physics::{Collisions, PhysicsSet},
    },
};

pub struct HealthPlugin(pub Interned<dyn ScheduleLabel>);

impl Plugin for HealthPlugin {
    fn build(&self, app: &mut App) {
        app.add_event::<KillEvent>();
        app.add_event::<DeathEvent>();
        app.add_event::<DestroyEvent>();

        app.add_systems(self.0, (
            system_collision_damage,
            system_regeneration,
            system_process_despawns,
            system_process_destroys,
            system_process_deaths,
            system_process_kills,
        ).after(PhysicsSet::NarrowPhase));
    }
}


fn system_process_kills(
    mut er_kills: EventReader<KillEvent>,
    q_owner: Query<&Owner>,
    mut q_score: Query<&mut Score>,
) {
    for event in er_kills.read() {
        let owner = q_owner.get(event.killer).map(|x| x.0).unwrap_or(event.killer);

        if let Ok(mut score) = q_score.get_mut(owner) {
            score.score += event.reward;
        }

        // TODO send notifications
    }
}

fn system_process_deaths(
    mut er_death: EventReader<DeathEvent>,
    mut ew_destroy: EventWriter<DestroyEvent>,
) {
    for event in er_death.read() {
        ew_destroy.send(DestroyEvent(event.0));
    }
}

fn system_process_destroys(
    mut er_destroy: EventReader<DestroyEvent>,
    query: Query<Has<DespawnMarker>>,
    mut commands: Commands,
) {
    for event in er_destroy.read() {
        if !query.get(event.0).unwrap_or(true) {
            commands.entity(event.0).insert(DespawnMarker(5));
        }
    }
}

fn system_process_despawns(
    mut commands: Commands,
    mut query: Query<(Entity, &mut DespawnMarker)>,
) {
    for (entity, mut marker) in query.iter_mut() {
        if marker.0 <= 0 {
            commands.entity(entity).despawn_recursive();
            continue;
        }
        marker.0 -= 1;
    }
}

// TODO make this framerate independant
fn system_regeneration(
    mut query: Query<(
        Entity,
        &mut Health,
        &LastDamageTick,
        &Regeneration,
        Has<InvincibilityMarker>
    )>,
    frame: Res<FrameCount>,
    mut ew_death: EventWriter<DeathEvent>,
) {
    for (entity, mut health, ldt, regen, has_invincibility) in query.iter_mut() {
        if health.health <= 0.0 {
            ew_death.send(DeathEvent(entity));
            continue;
        }

        // regen
        if health.health < health.max_health {
            health.health += regen.amount;
            if frame.0 - ldt.0 >= regen.boost_timeout {
                health.health += health.max_health * regen.boost_factor;
            }
            health.health = health.health.min(health.max_health);
        } else if has_invincibility {
            health.health = health.max_health;
        }
    }
}

fn system_collision_damage(
    mut query: Query<
        (
            &mut Health,
            &DefensePower,
            &AttackDeflection,
            &AttackDamage,
            &CriticalAttacks,
            &mut LastDamageTick,
            Option<&Team>,
            Option<&Owner>,
            Has<AttackCooldownMarker>,
        ),
        Without<InvincibilityMarker>,
    >,
    mut q_opacity: Query<(&mut Opacity, &OpacityModificationConfig)>,
    q_reward: Query<(&KillReward, Option<&Score>)>,
    collisions: Res<Collisions>,
    frame: Res<FrameCount>,
    mut ew_death: EventWriter<DeathEvent>,
    mut ew_kill: EventWriter<KillEvent>
) {
    let mut rng = thread_rng();

    for (ent1, ent2) in &collisions.0 {
        if let Ok(
            [(mut health1, defense1, deflection1, attack1, critical1, mut ldt1, team1, owner1, has_cooldown_1), (mut health2, defense2, deflection2, attack2, critical2, mut ldt2, team2, owner2, has_cooldown_2)],
        ) = query.get_many_mut([*ent1, *ent2])
        {
            if owner1.is_some() && owner1 == owner2 || team1.is_some() && team1 == team2 {
                continue;
            }

            let min_health = health1.health.min(health2.health);
            let mut damage1 = (attack1.0 / defense2.0).min(min_health);
            let mut damage2 = (attack2.0 / defense1.0).min(min_health);

            if rng.gen_bool(critical1.chance) {
                damage1 *= critical1.factor;
            }

            if rng.gen_bool(critical2.chance) {
                damage2 *= critical2.factor;
            }

            if rng.gen_bool(deflection2.miss_chance) || (has_cooldown_2 && ldt2.0 == frame.0) {
                damage1 = 0.0;
            }

            if rng.gen_bool(deflection1.miss_chance) || (has_cooldown_1 && ldt1.0 == frame.0) {
                damage2 = 0.0;
            }

            if rng.gen_bool(deflection2.deflection_chance) {
                damage1 -= damage1 * deflection2.deflection_factor;
            }

            if rng.gen_bool(deflection1.deflection_chance) {
                damage2 -= damage2 * deflection1.deflection_factor;
            }

            // TODO if both are tanks dmg *= 1.5, if both are projectiles dmg *= 4

            if damage1 != 0.0 {
                health2.health -= damage1.clamp(0.0, health2.health);
                ldt2.0 = frame.0;

                if let Ok((mut opacity, config)) = q_opacity.get_mut(*ent2) {
                    opacity.0 = (opacity.0 + config.on_attacked).clamp(0.0, 1.0);
                }

                if health2.health < 0.0001 {
                    health2.health = 0.0;
                    ew_death.send(DeathEvent(*ent2));
                    let reward = q_reward.get(*ent2).map(|(reward, score)| {
                        match reward {
                            KillReward::Score => score.map(|x| x.score).unwrap_or_default(),
                            KillReward::ScoreCapped(cap) => score.map(|x| x.score).unwrap_or_default().min(*cap),
                            KillReward::Exact(r) => *r
                        }
                    }).unwrap_or_default();
                    ew_kill.send(KillEvent {
                        killer: *ent1,
                        target: *ent2,
                        reward
                    });
                }
            }

            if damage2 != 0.0 {
                health1.health -= damage2.clamp(0.0, health1.health);
                ldt1.0 = frame.0;

                if let Ok((mut opacity, config)) = q_opacity.get_mut(*ent1) {
                    opacity.0 = (opacity.0 + config.on_attacked).clamp(0.0, 1.0);
                }

                if health1.health < 0.0001 {
                    health1.health = 0.0;
                    ew_death.send(DeathEvent(*ent1));
                    let reward = q_reward.get(*ent1).map(|(reward, score)| {
                        match reward {
                            KillReward::Score => score.map(|x| x.score).unwrap_or_default(),
                            KillReward::ScoreCapped(cap) => score.map(|x| x.score).unwrap_or_default().min(*cap),
                            KillReward::Exact(r) => *r
                        }
                    }).unwrap_or_default();
                    ew_kill.send(KillEvent {
                        killer: *ent2,
                        target: *ent1,
                        reward
                    });
                }
            }
        }
    }
}
