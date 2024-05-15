use std::f64::consts::{PI, TAU};

use bevy::log::error;
use web_sys::Path2d;

use crate::shared::util::shape::Shape;

impl From<Shape> for Path2d {
    fn from(value: Shape) -> Self {
        let path = Path2d::new().unwrap();
        match value {
            Shape::Segment { start, end } => {
                path.move_to(start.x.into(), start.y.into());
                path.line_to(end.x.into(), end.y.into());
            }
            Shape::Circle { radius } => {
                path.arc(0.0, 0.0, radius.into(), 0.0, TAU).unwrap();
            }
            Shape::Rect { width, height } => {
                path.rect(
                    -width as f64 / 2.0,
                    -height as f64 / 2.0,
                    width.into(),
                    height.into(),
                );
            }
            Shape::RoundRect {
                radius,
                width,
                height,
            } => {
                path.round_rect_with_f64(
                    -width as f64 / 2.0,
                    -height as f64 / 2.0,
                    width.into(),
                    height.into(),
                    radius.into(),
                )
                .unwrap();
            }
            Shape::Capsule { height, radius } => {
                path.round_rect_with_f64(
                    -radius as f64,
                    -height as f64 / 2.0,
                    radius as f64 * 2.0,
                    height.into(),
                    radius.into(),
                )
                .unwrap();
            }
            Shape::RegularPolygon { radius, sides } => {
                for i in 0..sides {
                    let mut angle = TAU * i as f64 / sides as f64;
                    if sides == 4 {
                        angle += PI / 4.0;
                    }
                    let radius = radius as f64;
                    let x = angle.cos() * radius;
                    let y = angle.sin() * radius;
                    match i == 0 {
                        true => path.move_to(x, y),
                        false => path.line_to(x, y),
                    }
                }
                path.close_path();
            }
            Shape::Star {
                radius,
                sides,
                depth,
            } => {
                for i in 0..(sides * 2) {
                    let mut angle = TAU * i as f64 / sides as f64;
                    if sides == 4 {
                        angle += PI / 4.0;
                    }
                    let radius = radius as f64;
                    let factor = match i % 2 {
                        0 => depth as f64,
                        _ => 1.0,
                    };
                    let x = angle.cos() * radius * factor;
                    let y = angle.sin() * radius * factor;
                    match i {
                        0 => path.move_to(x, y),
                        _ => path.line_to(x, y),
                    }
                }
                path.close_path();
            }
            Shape::IsoscelesTrapezoid {
                width,
                height,
                asymmetry,
            } => {
                path.move_to(-width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(width as f64 / 2.0, -height as f64 * asymmetry as f64 / 2.0);
                path.line_to(width as f64 / 2.0, height as f64 * asymmetry as f64 / 2.0);
                path.line_to(-width as f64 / 2.0, height as f64 / 2.0);
                path.close_path();
            }
            Shape::Parallelogram {
                width,
                height,
                offset,
            } => {
                path.move_to(-width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(width as f64 / 2.0, -height as f64 / 2.0);
                path.line_to(width as f64 / 2.0 + offset as f64, height as f64 / 2.0);
                path.line_to(-width as f64 / 2.0 + offset as f64, height as f64 / 2.0);
                path.close_path();
            }
            Shape::Kite { width, height } => {
                path.move_to(0.0, -height as f64 / 2.0);
                path.line_to(width as f64 / 2.0, 0.0);
                path.line_to(0.0, height as f64 / 2.0);
                path.line_to(-width as f64 / 2.0, 0.0);
                path.close_path();
            }
            Shape::Polygon { vertices } => {
                if vertices.len() < 2 {
                    error!("Unable to construct path for Shape::IrregularPolygon with less than 2 vertices");
                    return path;
                }
    
                path.move_to(vertices[0].x.into(), vertices[0].y.into());
    
                for vertex in vertices.iter().skip(1) {
                    path.line_to(vertex.x.into(), vertex.y.into());
                }
    
                path.close_path();
            }
        }

        path
    }
}