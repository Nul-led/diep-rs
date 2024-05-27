use std::f32::consts::PI;

use bevy::{
    ecs::{system::Query, world::World},
    hierarchy::BuildWorldChildren,
    math::{Quat, Vec2, Vec3},
    transform::{components::Transform, TransformBundle},
};
use bevy_xpbd_2d::{
    components::{Position, RigidBody, Rotation},
    plugins::collision::Collider,
};

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

pub fn test_system1(mut q_obj: Query<(&mut Rotation)>) {
    for (mut rot) in q_obj.iter_mut() {
        *rot += Rotation::from_radians(0.01);
    }
}

pub fn test_system(world: &mut World) {
    world.spawn(
        (Camera {
            fov: 0.3,
            mode: CameraMode::Absolute {
                target: Vec2::new(0.0,0.0),
            },
        }),
    );

    world.spawn(
        (
            GameMapInfo {
                grid_size: 50,
                size: Vec2::new(500.0, 500.0),
                padding: 200.0,
            }
        )
    );

    let shape = Shape::Rect {
        width: 50.0,
        height: 50.0,
    };

    world
        .spawn((
            RigidBody::Static,
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
            TransformBundle::from(
                Transform::from_xyz(-100.0, 0.0, 0.0)
                    .with_rotation(Rotation::from_radians(0.0).into()),
            ),
            ObjectName {
                name: "test".to_string(),
                draw_info: Some(DrawInfo {
                    fill: Some(Paint::ColorId(Colors::White)),
                    stroke: Some(Stroke {
                        width: 0.2,
                        paint: Some(Paint::ColorId(Colors::Black)),
                    }),
                }),
            },
        ))
        .with_children(|builder| {
            let shape = Shape::Rect {
                width: 50.0,
                height: 50.0,
            };

            builder.spawn((
                RigidBody::Static,
                Collider::from(&shape),
                ObjectShape(shape),
                ObjectZIndex(-1),
                ObjectDrawInfo(DrawInfo {
                    fill: Some(Paint::ColorId(Colors::Magenta)),
                    stroke: Some(Stroke {
                        width: 7.5,
                        paint: None,
                    }),
                }),
                TransformBundle::from(
                    Transform::from_xyz(-100.0, 0.0, 0.0)
                        .with_rotation(Rotation::from_radians(0.0).into())
                        .with_scale(Vec3::new(2.0, 2.0, 1.0)),
                ),
                ObjectName {
                    name: "test".to_string(),
                    draw_info: Some(DrawInfo {
                        fill: Some(Paint::ColorId(Colors::White)),
                        stroke: Some(Stroke {
                            width: 0.2,
                            paint: Some(Paint::ColorId(Colors::Black)),
                        }),
                    }),
                },
            ));
        });
}
