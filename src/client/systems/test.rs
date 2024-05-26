use bevy::{ecs::world::World, math::Vec2, transform::{components::Transform, TransformBundle}};
use bevy_xpbd_2d::{components::RigidBody, plugins::collision::Collider};

use crate::shared::{components::{camera::{Camera, CameraMode}, object::{ObjectDrawInfo, ObjectHealth, ObjectName, ObjectOpacity, ObjectScore, ObjectShape, ObjectZIndex}}, definitions::colors::Colors, util::{drawinfo::{DrawInfo, Stroke}, paint::Paint, shape::Shape}};



pub fn test_system(world: &mut World) {
    world.spawn((
        Camera {
            fov: 0.55,
            mode: CameraMode::Absolute { target: Vec2::new(300.0, 100.0) }
        }
    ));

    let shape = Shape::Circle { radius: 50.0 };

    world.spawn((
        RigidBody::Static,
        Collider::from(&shape),
        ObjectShape(shape),
        ObjectZIndex(0),
        ObjectDrawInfo(DrawInfo { fill: Some(Paint::ColorId(Colors::Blue1)), stroke: Some(Stroke { width: 7.5, paint: None }) }),
        TransformBundle::default(),
        ObjectName {
            name: "test shape".to_string(),
            draw_info: Some(DrawInfo { fill: Some(Paint::RGB(255, 255, 255)), stroke: Some(Stroke { paint: Some(Paint::RGB(0, 0, 0)), width: 0.2 }) }),
        },
        ObjectScore {
            score: 50000,
            draw_info: Some(DrawInfo { fill: Some(Paint::RGB(255, 255, 255)), stroke: Some(Stroke { paint: Some(Paint::RGB(0, 0, 0)), width: 0.2 }) }),
        },
    ));

    let shape = Shape::Kite { width: 500.0, height: 300.0 };

    world.spawn((
        RigidBody::Static,
        Collider::from(&shape),
        ObjectShape(shape),
        ObjectZIndex(-1),
        ObjectDrawInfo(DrawInfo { fill: Some(Paint::ColorId(Colors::Magenta)), stroke: Some(Stroke { width: 7.5, paint: None }) }),
        ObjectHealth {
            health: 50.0,
            max_health: 100.0,
            custom_healthbar_color: None,
        },
        TransformBundle::from_transform(Transform::from_xyz(0.0, 300.0, 0.0)),
    ));
}