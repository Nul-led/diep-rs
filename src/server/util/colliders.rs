use std::f32::consts::{PI, TAU};

use bevy::math::Vec2;
use bevy_xpbd_2d::{parry::shape::SharedShape, plugins::collision::Collider};

use crate::shared::util::shape::Shape;

impl Into<Collider> for Shape {
    fn into(self) -> Collider {
        match self {
            Self::Segment { start, end } => Collider::segment(start, end),
            Self::Circle { radius } => Collider::circle(radius),
            Self::Rect { width, height } => Collider::rectangle(width, height),
            Self::RoundRect {
                radius,
                width,
                height,
            } => Collider::from(SharedShape::round_cuboid(width, height, radius)),
            Self::Capsule { height, radius } => Collider::capsule(height, radius),
            Self::RegularPolygon { radius, sides } => {
                let mut vertices = Vec::with_capacity(sides);
                let angle_offset = if sides == 4 { PI / 4.0 } else { 0.0 };
                for i in 0..sides {
                    let angle = TAU * i as f32 / sides as f32 + angle_offset;
                    vertices.push(Vec2::new(angle.cos() * radius, angle.sin() * radius));
                }
                Collider::convex_hull(vertices).unwrap()
            },
            Self::Star {
                radius,
                sides,
                depth: _,
            } => Self::RegularPolygon { radius, sides }.into(),
            Self::IsoscelesTrapezoid {
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
            Self::Parallelogram {
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
            Self::Kite { width, height } => Collider::convex_hull(vec![
                Vec2::new(0.0, -height / 2.0),
                Vec2::new(width / 2.0, 0.0),
                Vec2::new(0.0, height / 2.0),
                Vec2::new(-width / 2.0, 0.0),
            ])
            .unwrap(),
            Self::Polygon { vertices } => Collider::convex_hull(vertices).unwrap(),
        }
    }
}
