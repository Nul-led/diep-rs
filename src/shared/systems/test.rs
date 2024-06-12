use std::{f32::consts::{FRAC_1_SQRT_2, PI}, ops::Range};

use bevy::{
    ecs::{entity::Entity, query::Without, system::{Commands, Query, Res}, world::World}, hierarchy::BuildWorldChildren, math::{primitives::{Circle, RegularPolygon}, Quat, Vec2, Vec3}, time::Time, transform::{components::{GlobalTransform, Transform}, TransformBundle}
};
use lightyear::{
    prelude::server::{Replicate, SyncTarget},
    shared::replication::{components::ReplicationGroup, network_target::NetworkTarget},
};
use rand::{distributions::Distribution, random, thread_rng, Rng};
use tracing::info;
use web_sys::window;

use crate::{server::{bundles::{camera::CameraBundle, game::GameBundle, physics::{MovementBundle, PhysicsBundle}}, components::{orbit::OrbitRoutine, rotation::RotationRoutine}}, shared::{
    components::{
        camera::ViewRange, game::GameMapInfo, markers::CameraMarker, object::{
            ObjectHealth, ObjectName, ObjectOpacity, ObjectScore,
            ObjectZIndex,
        }, physics::{AngularVelocity, Collider, ImpactPotency, ImpactResistance, LinearVelocity, RigidBody}
    },
    definitions::{colors::Colors, config::TICKS_PER_SECOND},
    util::{
        drawinfo::ObjectDrawConfig, paint::Paint, shape::ColliderTrace
    },
}};

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

pub fn system_spawner(
    q_map: Query<&GameMapInfo>,
    mut commands: Commands
) {
    for i in 0..2 {
        let shape = ColliderTrace::RegularPolygon(RegularPolygon {
            circumcircle: Circle::new(75.0),
            sides: 5,
        }, ObjectDrawConfig::Simple { fill: Paint::ColorId(Colors::Blue2) });
    
        commands.spawn((
            PhysicsBundle {
                collider: Collider::from(&shape),
                impact_potency: ImpactPotency(11.0),
                impact_resistance: ImpactResistance(0.5),
                ..Default::default()
            },
            MovementBundle::default(),
            shape,
            ObjectZIndex(0),
            Replicate::default(),
            //OrbitRoutine::default(),
            //RotationRoutine::default(),
        ));
    }
}


pub fn random_pos(min: Vec2, max: Vec2) -> Vec2 {
    let mut rng = thread_rng();
    Vec2::new(rng.gen_range(min.x .. max.x), rng.gen_range(min.y .. max.y))
}

pub fn minimum_velocity_system(mut query: Query<&mut LinearVelocity, Without<CameraMarker>>) {
    for mut velocity in query.iter_mut() {
        if velocity.length_squared() < 0.0001 {
            velocity.0 = Vec2::ZERO;
        }
    }
}