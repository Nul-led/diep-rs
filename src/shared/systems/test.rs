use std::f32::consts::PI;

use bevy::{
    ecs::{system::Query, world::World},
    hierarchy::BuildWorldChildren,
    math::{Quat, Vec2, Vec3},
    transform::{components::Transform, TransformBundle},
};
use bevy_xpbd_2d::{
    components::{
        AngularDamping, AngularVelocity, ColliderDensity, Friction, LinearDamping, LinearVelocity, MassPropertiesBundle, Position, RigidBody, Rotation
    },
    plugins::collision::Collider, resources::SleepingThreshold,
};
use lightyear::{prelude::server::{Replicate, SyncTarget}, shared::replication::network_target::NetworkTarget};
use rand::random;

use crate::shared::{
    components::{
        camera::{Camera, CameraMode},
        game::GameMapInfo,
        object::{
            ObjectDrawInfo, ObjectHealth, ObjectName, ObjectOpacity, ObjectScore, ObjectShape,
            ObjectZIndex,
        },
    },
    definitions::colors::Colors,
    util::{
        drawinfo::{DrawInfo, Stroke},
        paint::Paint,
        shape::Shape,
    },
};

pub fn test_system1(mut q_obj: Query<(&mut Rotation)>) {
    for (mut rot) in q_obj.iter_mut() {
        *rot += Rotation::from_radians(0.01);
    }
}

pub fn test_system(world: &mut World) {
    world.spawn((
        Camera {
            fov: 0.3,
            mode: CameraMode::Absolute {
                target: Vec2::new(0.0, 0.0),
            },
        },
        Replicate::default(),
    ));

    let map = GameMapInfo {
        grid_size: 50,
        size: Vec2::new(3000.0, 3000.0),
        padding: 200.0,
    };

    world.spawn((map, Replicate::default()));

    world.spawn((
        RigidBody::Static,
        Collider::segment(
            -map.size / 2.0,
            Vec2::new(map.size.x / 2.0, -map.size.y / 2.0),
        ),
        ColliderDensity(1.0),
    )); // top

    world.spawn((
        Collider::segment(
            Vec2::new(map.size.x / 2.0, -map.size.y / 2.0),
            map.size / 2.0,
        ),
        RigidBody::Static,
        ColliderDensity(1.0),
    )); // right

    world.spawn((
        Collider::segment(
            map.size / 2.0,
            Vec2::new(-map.size.x / 2.0, map.size.y / 2.0),
        ),
        RigidBody::Static,
        ColliderDensity(1.0),
    )); // bottom

    world.spawn((
        Collider::segment(
            Vec2::new(-map.size.x / 2.0, map.size.y / 2.0),
            -map.size / 2.0,
        ),
        RigidBody::Static,
        ColliderDensity(1.0),
    )); // left

    for i in 0..50 {
        let shape = Shape::Rect {
            width: 50.0,
            height: 50.0,
        };

        world.spawn((
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
            Position::from_xy(random::<f32>() * 500.0, random::<f32>() * 500.0),
            Replicate {
                sync: SyncTarget {
                    interpolation: NetworkTarget::All,
                    //prediction: NetworkTarget::All,
                    ..Default::default()
                },
                ..Default::default()
            },
            LinearDamping(0.1),
            AngularDamping(1.0),
        ));
    }
}

pub fn minimum_velocity_system(mut query: Query<&mut LinearVelocity>) {
    for mut velocity in query.iter_mut() {
        if velocity.length_squared() < 0.0001 {
            velocity.0 = Vec2::ZERO;
        }
    }
}