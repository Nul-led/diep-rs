use std::{f32::consts::{FRAC_PI_2, PI, TAU}, ops::Range};

use bevy::{
    app::Plugin,
    ecs::{
        change_detection::DetectChanges, component::Component, entity::{Entity, EntityMapper, MapEntities}, query::{With, Without}, schedule::{IntoSystemConfigs, IntoSystemSetConfigs, ScheduleLabel, SystemSet}, system::{Commands, Query, Res, ResMut, Resource}, world::Ref
    },
    hierarchy::Parent,
    math::Vec2,
    tasks::{ComputeTaskPool, ParallelSlice},
    transform::{
        components::{GlobalTransform, Transform},
        TransformSystem,
    },
    utils::intern::Interned,
};
use parry2d::{
    bounding_volume::{Aabb, BoundingVolume},
    math::Isometry,
    query::{DefaultQueryDispatcher, QueryDispatcher},
};
use rand::{thread_rng, Rng};
use tracing::info;
use web_sys::window;

use crate::shared::components::physics::{
    AngularVelocity, AngularVelocityConstraints, AngularVelocityRetention, Collider, Dominance, IgnoreCollisions, IgnoreStaticRigidBodies, ImpactDeflection, ImpactPotency, ImpactResistance, LinearVelocity, LinearVelocityConstraints, LinearVelocityRetention, PreSolveLinearVelocity, RigidBody
};

pub struct PhysicsPlugin(pub Interned<dyn ScheduleLabel>);

impl Plugin for PhysicsPlugin {
    fn build(&self, app: &mut bevy::prelude::App) {
        app.init_resource::<Intervals>();
        app.init_resource::<BroadCollisionPairs>();
        app.init_resource::<Collisions>();

        app.add_systems(self.0, (
            system_apply_velocity.in_set(PhysicsSet::ApplyVelocity),
            system_sweep_and_prune.in_set(PhysicsSet::BroadPhase),
            system_collect_collisions.in_set(PhysicsSet::NarrowPhase),
            system_solve_collisions.in_set(PhysicsSet::SolvingPhase),
        ));

        app.configure_sets(
            self.0,
            (
                PhysicsSet::ApplyVelocity,
                PhysicsSet::BroadPhase,
                PhysicsSet::NarrowPhase,
                PhysicsSet::SolvingPhase,
            )
                .chain()
                .before(TransformSystem::TransformPropagate),
        );
    }
}

#[derive(SystemSet, Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum PhysicsSet {
    ApplyVelocity,
    BroadPhase,
    NarrowPhase,
    SolvingPhase,
}

fn system_solve_collisions(
    mut query: Query<(
        &RigidBody,
        &GlobalTransform,
        &mut LinearVelocity,
        &ImpactResistance,
        &ImpactPotency,
        &ImpactDeflection,
        &Dominance,
        Option<&IgnoreStaticRigidBodies>,
    )>,
    collisions: Res<Collisions>,
) {
    for (entity1, entity2) in collisions.0.iter() {
        if let Ok(
            [(rb1, transform1, mut lin_vel1, res1, pot1, def1, dom1, opt_ign_static1), (rb2, transform2, mut lin_vel2, res2, pot2, def2, dom2, opt_ign_static2)],
        ) = query.get_many_mut([*entity1, *entity2])
        {
            let mut rand = thread_rng();

            let diff1 = transform1.translation_vec3a() - transform2.translation_vec3a();
            let diff2 = transform2.translation_vec3a() - transform1.translation_vec3a();

            let angle1 = diff1.truncate().to_angle();
            let angle2 = diff2.truncate().to_angle();

            let (angle1, angle2) = match angle1 == angle2 {
                true => {
                    let angle = rand.gen_range(0.0 .. 1.0) * TAU;
                    (angle, angle - PI)
                },
                false => (
                    angle1 * (1.0 + match def2.0 == 0.0 {
                        true => 0.0,
                        false => rand.gen_range(-def2.0..def2.0),
                    }),
                    angle2 * (1.0 + match def1.0 == 0.0 {
                        true => 0.0,
                        false => rand.gen_range(-def1.0..def1.0),
                    })
                )
            };

            if dom1.0 <= dom2.0
                && !rb1.is_static()
                && (opt_ign_static1.is_none() || (opt_ign_static1.is_some() && !rb2.is_static()))
            {
                lin_vel1.0 += Vec2::from_angle(angle1) * pot2.0 / res1.0;
            }

            if dom2.0 <= dom1.0
                && !rb2.is_static()
                && (opt_ign_static2.is_none() || (opt_ign_static2.is_some() && !rb1.is_static()))
            {
                lin_vel2.0 += Vec2::from_angle(angle2) * pot1.0 / res2.0;
            }
        }
    }
}

fn system_apply_velocity(
    mut query: Query<
        (
            &RigidBody,
            &mut Transform,
            &mut LinearVelocity,
            &mut PreSolveLinearVelocity,
            &mut AngularVelocity,
            &LinearVelocityRetention,
            &AngularVelocityRetention,
            &LinearVelocityConstraints,
            &AngularVelocityConstraints
        )
    >,
) {
    for (
        rb,
        mut transform,
        mut lin_vel,
        mut pre_solve_lin_vel,
        mut ang_vel,
        lin_vel_ret,
        ang_vel_ret,
        lin_vel_con,
        ang_vel_con,
    ) in query.iter_mut()
    {
        lin_vel.0 *= lin_vel_ret.0;

        let length_sq = lin_vel.0.length_squared();
        if length_sq < lin_vel_con.0.powi(2) {
            lin_vel.0 = Vec2::ZERO;
        } else if length_sq > lin_vel_con.1.powi(2) {
            lin_vel.0 = lin_vel.0.normalize_or_zero() * lin_vel_con.1;
        }

        //info!("{}", lin_vel.0.length());

        ang_vel.0 *= ang_vel_ret.0;

        if ang_vel.0 < ang_vel_con.0 {
            ang_vel.0 = 0.0;
        } else if ang_vel.0 > ang_vel_con.1 {
            ang_vel.0 = ang_vel_con.1;
        }
        
        pre_solve_lin_vel.0 = lin_vel.0;

        if rb.is_static() {
            continue;
        }

        transform.translation += lin_vel.0.extend(0.0);
        transform.rotate_z(ang_vel.0);
    }
}

fn system_collect_collisions(
    q_colliders: Query<(&GlobalTransform, &Collider)>,
    pairs: Res<BroadCollisionPairs>,
    mut collisions: ResMut<Collisions>,
) {
    collisions.0.clear();

    if pairs.0.len() == 0 {
        return;
    }

    let pool = ComputeTaskPool::get();

    collisions.0.extend(
        pairs
            .0
            .iter()
            .par_splat_map(pool, None, |chunks| {
                let mut collisions: Vec<(Entity, Entity)> = vec![];
                for &(entity1, entity2) in chunks {
                    if let Ok([(transform1, col1), (transform2, col2)]) =
                        q_colliders.get_many([entity1, entity2])
                    {
                        let (_, rotation1, translation1) =
                            transform1.to_scale_rotation_translation();
                        let (_, rotation2, translation2) =
                            transform2.to_scale_rotation_translation();
                        if check_collision_pair(
                            (translation1.truncate(), rotation1.z, col1),
                            (translation2.truncate(), rotation2.z, col2),
                        ) {
                            collisions.push((entity1, entity2));
                        }
                    }
                }
                collisions
            })
            .into_iter()
            .flatten(),
    );
}

pub fn check_collision_pair(
    entity1: (Vec2, f32, &Collider),
    entity2: (Vec2, f32, &Collider),
) -> bool {
    let isometry1 = Isometry::<f32>::new(entity1.0.into(), entity1.1);
    let isometry2 = Isometry::<f32>::new(entity2.0.into(), entity2.1);
    let isometry12 = isometry1.inv_mul(&isometry2);
    DefaultQueryDispatcher
        .intersection_test(
            &isometry12,
            entity1.2 .0 .0.as_ref(),
            entity2.2 .0 .0.as_ref(),
        )
        .unwrap()
}

#[derive(Resource, Clone, Default, PartialEq)]
pub struct Collisions(pub Vec<(Entity, Entity)>);

impl MapEntities for Collisions {
    fn map_entities<M: EntityMapper>(&mut self, entity_mapper: &mut M) {
        for pair in self.0.iter_mut() {
            pair.0 = entity_mapper.map_entity(pair.0);
            pair.1 = entity_mapper.map_entity(pair.1);
        }
    }
}

impl Collisions {
    pub fn contains(&self, entity1: Entity, entity2: Entity) -> bool {
        self.0.contains(&(entity1, entity2)) || self.0.contains(&(entity2, entity1))
    }

    pub fn collisions_with_entity(&self, entity: Entity) -> impl Iterator<Item = &Entity> {
        self.0.iter().filter_map(move |(e1, e2)| {
            if *e1 == entity {
                Some(e2)
            } else if *e2 == entity {
                Some(e1)
            } else {
                None
            }
        })
    }

    pub fn remove_collision_pair(&mut self, entity1: Entity, entity2: Entity) -> bool {
        if let Some(idx) = self
            .0
            .iter()
            .position(|x| *x == (entity1, entity2) || *x == (entity2, entity1))
        {
            self.0.swap_remove(idx);
            return true;
        }
        false
    }

    pub fn remove_collisions_with_entity(&mut self, entity: Entity) {
        self.0.retain(|(a, b)| *a != entity && *b != entity);
    }
}

#[derive(Resource, Default)]
pub struct BroadCollisionPairs(pub Vec<(Entity, Entity)>);

impl MapEntities for BroadCollisionPairs {
    fn map_entities<M: EntityMapper>(&mut self, entity_mapper: &mut M) {
        for pair in self.0.iter_mut() {
            pair.0 = entity_mapper.map_entity(pair.0);
            pair.1 = entity_mapper.map_entity(pair.1);
        }
    }
}

type IsBodyInactive = bool;

#[derive(Resource, Default)]
pub struct Intervals(pub Vec<(Entity, IsBodyInactive, Aabb)>);

impl MapEntities for Intervals {
    fn map_entities<M: EntityMapper>(&mut self, entity_mapper: &mut M) {
        for interval in self.0.iter_mut() {
            interval.0 = entity_mapper.map_entity(interval.0);
        }
    }
}

#[derive(Clone, Copy, Default, Component)]
struct IntervalMarker;

fn system_sweep_and_prune(
    mut intervals: ResMut<Intervals>,
    mut pairs: ResMut<BroadCollisionPairs>,
    q_colliders: Query<(&Collider, Ref<GlobalTransform>, &RigidBody), (Without<Parent>, Without<IgnoreCollisions>)>,
    q_unmarked_colliders: Query<Entity, (Without<IntervalMarker>, With<Collider>, Without<IgnoreCollisions>)>,
    mut commands: Commands,
) {
    intervals.0.retain_mut(|(entity, is_body_inactive, aabb)| {
        if let Ok((collider, transform, rb)) = q_colliders.get(*entity) {
            if rb.is_none() {
                return false;
            }
            let (_, rotation, translation) = transform.to_scale_rotation_translation();
            *aabb = collider.aabb(translation.truncate(), rotation.z);
            *is_body_inactive = rb.is_static() || !transform.is_changed();
            true
        } else {
            false
        }
    });

    for entity in q_unmarked_colliders.iter() {
        if let Ok((collider, transform, rb)) = q_colliders.get(entity) {
            if rb.is_none() {
                continue;
            }
            let (_, rotation, translation) = transform.to_scale_rotation_translation();
            intervals.0.push((
                entity,
                rb.is_static(),
                collider.aabb(translation.truncate(), rotation.z),
            ));
            commands.entity(entity).insert(IntervalMarker);
        }
    }

    insertion_sort(&mut intervals.0, |a, b| a.2.mins.x > b.2.mins.x);

    pairs.0.clear();

    for (i, (ent1, inactive1, aabb1)) in intervals.0.iter().enumerate() {
        for (ent2, inactive2, aabb2) in intervals.0.iter().skip(i + 1) {
            // x doesn't intersect; check this first so we can discard as soon as possible
            if aabb2.mins.x > aabb1.maxs.x {
                break;
            }

            // No collisions between static bodies
            if *inactive1 && *inactive2 {
                continue;
            }

            // y doensn't intersect
            if aabb1.mins.y > aabb2.maxs.y || aabb1.maxs.y < aabb2.mins.y {
                continue;
            }

            pairs.0.push((*ent1, *ent2));
        }
    }
}

fn insertion_sort<T>(items: &mut [T], comparison: fn(&T, &T) -> bool) {
    for i in 1..items.len() {
        let mut j = i;
        while j > 0 && comparison(&items[j - 1], &items[j]) {
            items.swap(j - 1, j);
            j -= 1;
        }
    }
}

pub fn collision_test(intervals: &Intervals, aabb: &Aabb) -> bool {
    intervals
        .0
        .binary_search_by(|e| {
            if e.2.intersects(aabb) {
                std::cmp::Ordering::Equal
            } else if aabb.mins.x < e.2.mins.x {
                std::cmp::Ordering::Greater
            } else {
                std::cmp::Ordering::Less
            }
        })
        .is_ok()
}
