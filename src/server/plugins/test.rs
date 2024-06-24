use bevy::{app::{FixedUpdate, Plugin, Startup}, prelude::{Condition, IntoSystem, IntoSystemConfigs, Local}};

use std::{f32::consts::{FRAC_1_SQRT_2, PI}, ops::Range};

use bevy::{
    ecs::{entity::Entity, query::Without, system::{Commands, Query, Res}, world::World}, hierarchy::{BuildChildren, BuildWorldChildren}, math::{primitives::{Circle, Rectangle, RegularPolygon}, Quat, Vec2, Vec3}, prelude::{BoxedPolygon, Capsule2d, Triangle2d}, time::Time, transform::{components::{GlobalTransform, Transform}, TransformBundle}
};
use lightyear::{
    prelude::server::{Replicate, SyncTarget},
    shared::replication::{components::ReplicationGroup, network_target::NetworkTarget},
};
use rand::{distributions::Distribution, random, thread_rng, Rng};
use tracing::info;
use web_sys::window;

use crate::{server::{bundles::{camera::CameraBundle, game::GameBundle, physics::{MovementBundle, PhysicsBundle}}, components::{health::{AttackCooldownMarker, AttackDamage, AttackDeflection, CriticalAttacks, DefensePower, LastDamageTick, Regeneration}, orbit::OrbitRoutine, reward::KillReward, rotation::RotationRoutine}}, shared::{
    components::{
        camera::ViewRange, game::GameMapInfo, markers::CameraMarker, object::{
            Health, Name, Opacity, Score,
            ZIndex,
        }, physics::{AngularVelocity, Collider, ImpactPotency, ImpactResistance, LinearVelocity, RigidBody}
    },
    definitions::{colors::Colors, config::TICKS_PER_SECOND},
    util::{
        drawinfo::ObjectDrawConfig, paint::Paint, shape::{ColliderTrace, IntoIsometry2}
    },
}};

#[derive(Clone, Copy, Default)]
pub struct TestPlugin;

impl Plugin for TestPlugin {
    fn build(&self, app: &mut bevy::prelude::App) {
        app.add_systems(Startup, (test_system, ));

        app.add_systems(FixedUpdate, (scaler,
            hierarchy_spawner.run_if(under()),
            //system_spawner.run_if(under()),
        ));
    }
}

fn under() -> impl Condition<()> {
    IntoSystem::into_system(|mut flag: Local<usize>| {
        *flag += 1;
        *flag <= 100
    })
}

pub fn test_system(world: &mut World) {
    world.spawn((
        CameraBundle::new(0),
        Replicate::default()
    ));

    let map = GameMapInfo {
        grid_size: 50,
        size: Vec2::new(3000.0, 3000.0),
        padding: 200.0,
    };

    world.spawn((
        GameBundle {
            map,
            ..Default::default()
        },
        Replicate::default()
    ));
    /* 
    world.spawn((
        Collider::segment(
            -map.size / 2.0,
            Vec2::new(map.size.x / 2.0, -map.size.y / 2.0),
        ),
        RigidBody::Static,
    )); // top

    world.spawn((
        Collider::segment(
            Vec2::new(map.size.x / 2.0, -map.size.y / 2.0),
            map.size / 2.0,
        ),
        RigidBody::Static,
    )); // right

    world.spawn((
        Collider::segment(
            map.size / 2.0,
            Vec2::new(-map.size.x / 2.0, map.size.y / 2.0),
        ),
        RigidBody::Static,
    )); // bottom

    world.spawn((
        Collider::segment(
            Vec2::new(-map.size.x / 2.0, map.size.y / 2.0),
            -map.size / 2.0,
        ),
        RigidBody::Static,
    )); // left

    */
}

pub fn hierarchy_spawner(
    mut commands: Commands,
) {
    let shape = ColliderTrace::RegularPolygon(RegularPolygon {
        circumcircle: Circle::new(50.0),
        sides: 4,
    }, ObjectDrawConfig::Simple { fill: Paint::ColorId(Colors::Yellow1) });

    commands.spawn((
        PhysicsBundle {
            collider: Collider::from(&shape),
            ..Default::default()
        },
        (
            Health {
                max_health: 500.0,
                health: 250.0,
                ..Default::default()
            },
            Regeneration::default(),
            LastDamageTick::default(),
            CriticalAttacks::default(),
            //AttackCooldownMarker,
            AttackDamage::default(),
            AttackDeflection::default(),
            DefensePower::default(),
            MovementBundle::default(),
        ),
        Score::default(),
        Name {
            name: "Square".to_string(),
            ..Default::default()
        },
        KillReward::Exact(50),
        shape,
        ZIndex(0),
        Replicate::default(),
        RotationRoutine::default(),
        OrbitRoutine::default(),
    ));
}

pub fn scaler(
    mut query: Query<&mut ColliderTrace>
) {
    //query.iter_mut().for_each(|mut x| x.scale_by(1.005));
}

pub fn system_spawner(
    q_map: Query<&GameMapInfo>,
    mut commands: Commands
) {
    for i in 0..1 {
        let shape = ColliderTrace::RegularPolygon(RegularPolygon {
            circumcircle: Circle::new(50.0),
            sides: 4,
        }, ObjectDrawConfig::Simple { fill: Paint::ColorId(Colors::Yellow1) });
        

        commands.spawn((
            PhysicsBundle {
                collider: Collider::from(&shape),
                impact_potency: ImpactPotency(8.0),
                impact_resistance: ImpactResistance(1.0),
                ..Default::default()
            },
            MovementBundle {
                //transform: TransformBundle::from_transform(Transform::from_translation(random_pos(-Vec2::new(500.0, 500.0), Vec2::new(500.0, 500.0)).extend(0.0))),
                ..Default::default()
            },
            shape,
            ZIndex(0),
            Replicate::default(),
            OrbitRoutine::default(),
            RotationRoutine::default(),
        ));
    }
}

pub fn random_pos(min: Vec2, max: Vec2) -> Vec2 {
    let mut rng = thread_rng();
    Vec2::new(rng.gen_range(min.x .. max.x), rng.gen_range(min.y .. max.y))
}