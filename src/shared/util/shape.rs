use bevy::{
    ecs::{bundle::Bundle, component::Component},
    math::{
        primitives::{
            BoxedPolygon, BoxedPolyline2d, Capsule2d, Circle, Line2d, Plane2d, Polyline2d,
            Primitive2d, Rectangle, RegularPolygon, Segment2d, Triangle2d,
        },
        Vec2,
    },
    reflect::Tuple,
};
use parry2d::{
    math::{Isometry, Real},
    shape::SharedShape,
};
use serde::{Deserialize, Serialize};

use crate::shared::components::physics::Collider;

use super::drawinfo::ObjectDrawConfig;

/// A isosceles trapezoid primitive
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct IsoscelesTrapezoid {
    /// Half of the width and height of the rectangle
    pub half_size: Vec2,
    /// The asymmetry between the longer and shorter side
    pub asymmetry: f32,
}

impl Primitive2d for IsoscelesTrapezoid {}

impl Default for IsoscelesTrapezoid {
    fn default() -> Self {
        Self {
            half_size: Vec2::splat(0.5),
            asymmetry: 0.25,
        }
    }
}

/// A regular star primitive
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct RegularStar {
    pub regular_polygon: RegularPolygon,
    pub depth: f32,
}

impl Primitive2d for RegularStar {}

impl Default for RegularStar {
    fn default() -> Self {
        Self {
            regular_polygon: RegularPolygon::default(),
            depth: 0.4,
        }
    }
}

// TODO: Parallelogram, Kite, Rounded (Triangle, Rectangle, polygon, regularpolygon, isosceles trapezoid, star)

/*
/// A rounded rectangle primitive
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct RoundedRectangle {
    /// Half of the width and height of the rounded rectangle
    pub half_size: Vec2,
    /// The corner radius of the rounded rectangle
    pub corner_radius: f32
}

impl Primitive2d for RoundedRectangle {}

impl Default for RoundedRectangle {
    fn default() -> Self {
        Self {
            half_size: Vec2::splat(0.5),
            corner_radius: 0.1,
        }
    }
}

            ColliderPathOverride::IsoscelesTrapezoid {
                width,
                height,
                asymmetry,
            } => {
                path.move_to(-width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(*width as f64 / 2.0, -height as f64 * *asymmetry as f64 / 2.0);
                path.line_to(*width as f64 / 2.0, *height as f64 * *asymmetry as f64 / 2.0);
                path.line_to(-width as f64 / 2.0, *height as f64 / 2.0);
                path.close_path();
            }
            ColliderPathOverride::Parallelogram {
                width,
                height,
                offset,
            } => {
                path.move_to(-width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(*width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(*width as f64 / 2.0 + *offset as f64, *height as f64 / 2.0);
                path.line_to(-width as f64 / 2.0 + *offset as f64, *height as f64 / 2.0);
                path.close_path();
            }
            ColliderPathOverride::Kite { width, height } => {
                path.move_to(0.0, -height as f64 / 2.0);
                path.line_to(*width as f64 / 2.0, 0.0);
                path.line_to(0.0, *height as f64 / 2.0);
                path.line_to(-width as f64 / 2.0, 0.0);
                path.close_path();
            }

*/

#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct IntoIsometry2(pub Vec2, pub f32);

impl From<IntoIsometry2> for Isometry<Real> {
    fn from(value: IntoIsometry2) -> Self {
        Isometry::new(value.0.into(), value.1)
    }
}

#[derive(Component, Clone, PartialEq, Serialize, Deserialize)]
pub enum ColliderTrace {
    Circle(Circle, ObjectDrawConfig),
    Rectangle(Rectangle, ObjectDrawConfig),
    Triangle(Triangle2d, ObjectDrawConfig),
    RegularPolygon(RegularPolygon, ObjectDrawConfig),
    Segment(Segment2d, ObjectDrawConfig),
    Capsule(Capsule2d, ObjectDrawConfig),
    Plane(Plane2d, ObjectDrawConfig),
    Line(Line2d, ObjectDrawConfig),
    Polyline(BoxedPolyline2d, ObjectDrawConfig),
    /// Concave polygons are not allowed
    Polygon(BoxedPolygon, ObjectDrawConfig),
    /// Star collider is unsupported; will be converted into regular polygon for collision purposes
    RegularStar(RegularStar, ObjectDrawConfig),
    /// Nested composite shapes are not allowed
    Compound(Vec<(IntoIsometry2, ColliderTrace)>),
}

impl Default for ColliderTrace {
    fn default() -> Self {
        Self::Circle(Circle::default(), ObjectDrawConfig::default())
    }
}

impl From<ColliderTrace> for Collider {
    fn from(value: ColliderTrace) -> Self {
        (&value).into()
    }
}

impl From<&ColliderTrace> for Collider {
    fn from(value: &ColliderTrace) -> Self {
        match value {
            ColliderTrace::Circle(s, _) => (*s).into(),
            ColliderTrace::Rectangle(s, _) => (*s).into(),
            ColliderTrace::Triangle(s, _) => (*s).into(),
            ColliderTrace::RegularPolygon(s, _) => (*s).into(),
            ColliderTrace::Segment(s, _) => (*s).into(),
            ColliderTrace::Capsule(s, _) => (*s).into(),
            ColliderTrace::Plane(s, _) => (*s).into(),
            ColliderTrace::Line(s, _) => (*s).into(),
            ColliderTrace::Polyline(s, _) => s.into(),
            ColliderTrace::Polygon(s, _) => s.into(),
            ColliderTrace::RegularStar(s, _) => (*s).into(),
            ColliderTrace::Compound(s) => Self(SharedShape::compound(
                s.iter()
                    .map(|(isometry, trace)| (Isometry::from(*isometry), Collider::from(trace).0))
                    .collect(),
            )),
        }
    }
}
