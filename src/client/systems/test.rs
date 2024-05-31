use std::f32::consts::PI;

use bevy::{
    ecs::{entity::Entity, system::Query, world::World},
    hierarchy::BuildWorldChildren,
    math::{Quat, Vec2, Vec3},
    transform::{components::Transform, TransformBundle},
};
use bevy_xpbd_2d::{
    components::{Position, RigidBody, Rotation},
    plugins::collision::Collider,
};
use tracing::info;

use crate::shared::{
    components::{
        camera::{Camera, CameraMode}, game::GameMapInfo, object::{
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
};

pub fn test_system1(mut q_obj: Query<(Entity)>) {
    info!("{}", q_obj.iter().len());
}