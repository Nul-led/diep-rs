use bevy::math::Vec2;

#[derive(Clone, Debug)]
pub enum Shape {
    Segment {
        start: Vec2,
        end: Vec2,
    },
    Circle {
        radius: f32, // >= 0
    },
    Rect {
        width: f32,  // >= 0
        height: f32, // >= 0
    },
    RoundRect {
        radius: f32, // >= 0
        width: f32,  // >= 0
        height: f32, // >= 0
    },
    Capsule {
        height: f32, // >= 0
        radius: f32, // >= 0
    },
    RegularPolygon {
        radius: f32,  // >= 0
        sides: usize, // >= 3
    },
    /// Represented as a regular polygon in physics due to missing support for concave shapes
    Star {
        radius: f32,  // >= 0
        sides: usize, // >= 3
        depth: f32,   // the factor by which the "inner" points are scaled
    },
    IsoscelesTrapezoid {
        width: f32,     // >= 0
        height: f32,    // >= 0
        asymmetry: f32, // the factor by which the width is scaled
    },
    Parallelogram {
        width: f32,  // >= 0
        height: f32, // >= 0
        offset: f32, // the offset of the lower side
    },
    Kite {
        width: f32,  // >= 0
        height: f32, // >= 0
    },
    /// Needs to be convex for collision detection
    Polygon {
        vertices: Vec<Vec2>,
    },
}

impl Default for Shape {
    fn default() -> Self {
        Self::Circle { radius: 1.0 }
    }
}
