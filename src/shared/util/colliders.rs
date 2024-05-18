use std::f32::consts::{PI, TAU};

use bevy::math::Vec2;
use bevy_xpbd_2d::{parry::shape::SharedShape, plugins::collision::Collider};

use crate::shared::util::shape::Shape;

impl From<&Shape> for Collider {
    fn from(value: &Shape) -> Self {
        match value {
            Shape::Segment { start, end } => Collider::segment(*start, *end),
            Shape::Circle { radius } => Collider::circle(*radius),
            Shape::Rect { width, height } => Collider::rectangle(*width, *height),
            Shape::RoundRect {
                radius,
                width,
                height,
            } => Collider::from(SharedShape::round_cuboid(*width, *height, *radius)),
            Shape::Capsule { height, radius } => Collider::capsule(*height, *radius),
            Shape::RegularPolygon { radius, sides } => {
                let mut vertices = Vec::with_capacity(*sides);
                let angle_offset = if *sides == 4 { PI / 4.0 } else { 0.0 };
                for i in 0..*sides {
                    let angle = TAU * i as f32 / *sides as f32 + angle_offset;
                    vertices.push(Vec2::new(angle.cos() * radius, angle.sin() * radius));
                }
                Collider::convex_hull(vertices).unwrap()
            },
            Shape::Star {
                radius,
                sides,
                depth: _,
            } => (&Shape::RegularPolygon { radius: *radius, sides: *sides }).into(),
            Shape::IsoscelesTrapezoid {
                width,
                height,
                asymmetry,
            } => Collider::convex_hull(vec![
                Vec2::new(-width / 2.0, -height / 2.0),
                Vec2::new(width / 2.0, -height * asymmetry / 2.0),
                Vec2::new(width / 2.0, height * asymmetry / 2.0),
                Vec2::new(-width / 2.0, height / 2.0),
            ])
            .unwrap(),
            Shape::Parallelogram {
                width,
                height,
                offset,
            } => Collider::convex_hull(vec![
                Vec2::new(-width / 2.0, -height / 2.0),
                Vec2::new(width / 2.0, -height / 2.0),
                Vec2::new(width / 2.0 + offset, height / 2.0),
                Vec2::new(-width / 2.0 + offset, height / 2.0),
            ])
            .unwrap(),
            Shape::Kite { width, height } => Collider::convex_hull(vec![
                Vec2::new(0.0, -height / 2.0),
                Vec2::new(width / 2.0, 0.0),
                Vec2::new(0.0, height / 2.0),
                Vec2::new(-width / 2.0, 0.0),
            ])
            .unwrap(),
            Shape::Polygon { vertices } => Collider::convex_hull(vertices.to_owned()).unwrap(),
        }
    }
}
