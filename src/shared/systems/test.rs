use std::{f32::consts::PI, ops::Range};

use bevy::{
    ecs::{entity::Entity, system::{Commands, Query, Res}, world::World}, hierarchy::BuildWorldChildren, math::{Quat, Vec2, Vec3}, time::Time, transform::{components::Transform, TransformBundle}
};
use bevy_xpbd_2d::{
    components::{
        AngularDamping, AngularVelocity, CenterOfMass, CoefficientCombine, ColliderDensity, ExternalImpulse, Friction, Inertia, InverseInertia, InverseMass, LinearDamping, LinearVelocity, LockedAxes, Mass, MassPropertiesBundle, Position, Restitution, RigidBody, Rotation
    },
    plugins::collision::Collider,
    resources::SleepingThreshold,
};
use lightyear::{
    prelude::server::{Replicate, SyncTarget},
    shared::replication::{components::ReplicationGroup, network_target::NetworkTarget},
};
use rand::{distributions::Distribution, random, thread_rng, Rng};
use tracing::info;

use crate::{server::{bundles::{camera::CameraBundle, game::GameBundle}, components::{orbit::OrbitRoutine, rotation::RotationRoutine}}, shared::{
    components::{
        camera::ViewRange, game::GameMapInfo, object::{
            ObjectDrawInfo, ObjectHealth, ObjectName, ObjectOpacity, ObjectScore, ObjectShape,
            ObjectZIndex,
        }
    },
    definitions::colors::Colors,
    util::{
        drawinfo::{DrawInfo, Stroke},
        paint::Paint,
        shape::Shape,
    },
}};

pub fn test_system(world: &mut World) {
    world.spawn((
        CameraBundle {
            view: ViewRange(0.3),
            ..Default::default()
        },
        Replicate::default(),
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
    let shape = Shape::Rect {
        width: 50.0,
        height: 50.0,
    };

    commands.spawn((
        RigidBody::Dynamic,
        Collider::from(&shape),
        ObjectShape(shape),
        ObjectZIndex(0),
        ObjectDrawInfo(DrawInfo {
            fill: Some(Paint::ColorId(Colors::Blue1)),
            stroke: Some(Stroke {
                width: 7.5,
                paint: None,
            }),
        }),
        Replicate::default(),
        //LinearDamping(0.1),
        //AngularDamping(0.1),
        Restitution::new(0.1).with_combine_rule(CoefficientCombine::Multiply),
        ColliderDensity(1.0),
        Position::from_xy(random::<f32>() * 5.0, random::<f32>() * 5.0),
        //Position::new(random_pos(map.size / -2.0, map.size / 2.0)),
        OrbitRoutine::default(),
        RotationRoutine::default(),
    ));

}


pub fn random_pos(min: Vec2, max: Vec2) -> Vec2 {
    let mut rng = thread_rng();
    Vec2::new(rng.gen_range(min.x .. max.x), rng.gen_range(min.y .. max.y))
}

pub fn minimum_velocity_system(mut query: Query<&mut LinearVelocity>) {
    for mut velocity in query.iter_mut() {
        velocity.0 *= 0.9;

        if velocity.length_squared() < 0.0001 {
            velocity.0 = Vec2::ZERO;
        }
    }
}

pub fn a(q_r: Query<(Entity, &AngularVelocity, &Rotation)>) {
    for (e, v, r) in q_r.iter() {
        //info!("{:?} {} {}", e, v.0, r.as_radians());
    }
}