use std::{f32::consts::FRAC_PI_2, f64::consts::{PI, TAU}};

use bevy::math::Vec2;

use crate::shared::util::{drawinfo::DrawConfig, shape::ColliderTrace};

use super::context::Context;

fn trace_rounded(ctx: &Context, vertices: &Vec<(Vec2, f32)>) {
    let vertex_count = vertices.len();

    if vertex_count < 3 {
        panic!("Rounded shapes need to have at least three vertices")
    }

    let mut vertex1 = vertices[vertex_count - 1];

    for i in 0..vertex_count {
        let vertex2 = vertices[i % vertex_count];
        let vertex3 = vertices[(i + 1) % vertex_count];
        
        let v1 = vertex1.0 - vertex2.0;
        let v2 = vertex3.0 - vertex2.0;
        let v1n = v1.normalize();
        let v2n = v2.normalize();
        
        let angle = v1n.perp_dot(v2n).asin().clamp(-1.0, 1.0);

        let (angle, rad_dir, draw_dir) = if v1.dot(v2) < 0.0 {
            match angle < 0.0 {
                true => (
                    angle + std::f32::consts::PI,
                    1.0,
                    false
                ),
                false => (
                    angle - std::f32::consts::PI,
                    -1.0,
                    true
                ),
            }
        } else {
            match angle > 0.0 {
                true => (angle, -1.0, true),
                false => (angle, 1.0, false),
            }
        };

        let half_angle = angle / 2.0;
        let max_len = (v1.length() / 2.0).min(v2.length() / 2.0);
        let len_out = (half_angle.cos() * vertex2.1 / half_angle.sin()).abs();
        let (radius, len_out) = match len_out > max_len {
            true => (
                max_len,
                (len_out * half_angle.sin() / half_angle.cos()).abs()
            ),
            false => (
                len_out,
                vertex2.1
            )
        };

        let pos = vertex2.0 + v2n * len_out + v2n.perp() * rad_dir * radius;

        ctx.arc_with_anticlockwise(pos.x as f64, pos.y as f64, radius as f64, (v1n.to_angle() + FRAC_PI_2 * rad_dir) as f64, (v2n.to_angle() - FRAC_PI_2 * rad_dir) as f64, draw_dir);

        vertex1 = vertex2;
    }

    ctx.close_path();
}

pub fn trace_collider(ctx: &Context, trace: &ColliderTrace) {
    ctx.begin_path();
    match trace {
        ColliderTrace::Circle(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            ctx.arc(0.0, 0.0, shape.radius as f64, 0.0, TAU).unwrap();
        },
        ColliderTrace::Rectangle(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            ctx.rect(
                -shape.half_size.x as f64,
                -shape.half_size.y as f64,
                shape.half_size.x as f64 * 2.0,
                shape.half_size.y as f64 * 2.0,
            );
        },
        ColliderTrace::Triangle(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            ctx.move_to(shape.vertices[0].x as f64, shape.vertices[0].y as f64);
            ctx.line_to(shape.vertices[1].x as f64, shape.vertices[1].y as f64);
            ctx.line_to(shape.vertices[2].x as f64, shape.vertices[2].y as f64);
            ctx.close_path();
        },
        ColliderTrace::RegularPolygon(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let mut vertices = shape.vertices(0.0).into_iter();
            let first_vertex = vertices.next().unwrap();
            ctx.move_to(first_vertex.x as f64, first_vertex.y as f64);
            for vertex in vertices {
                ctx.line_to(vertex.x as f64, vertex.y as f64);
            }
            ctx.close_path();
        },
        ColliderTrace::Segment(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let (point1, point2) = (shape.point1(), shape.point2());
            ctx.move_to(point1.x as f64, point1.y as f64);
            ctx.line_to(point2.x as f64, point2.y as f64);
        },
        ColliderTrace::Capsule(shape, draw_config) => {
            //DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            // TODO
        },
        ColliderTrace::Plane(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let vec = shape.normal.perp() * 50.000;
            ctx.move_to(-vec.x as f64, -vec.y as f64);
            ctx.line_to(vec.x as f64, vec.y as f64);
        },
        ColliderTrace::Line(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let vec = *shape.direction * 50.000;
            ctx.move_to(-vec.x as f64, -vec.y as f64);
            ctx.line_to(vec.x as f64, vec.y as f64);
        },
        ColliderTrace::Polyline(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let mut vertices = shape.vertices.iter();
            let first_vertex = vertices.next().unwrap();
            ctx.move_to(first_vertex.x as f64, first_vertex.y as f64);
            for vertex in vertices {
                ctx.line_to(vertex.x as f64, vertex.y as f64);
            }
        },
        ColliderTrace::Polygon(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            let mut vertices = shape.vertices.iter();
            let first_vertex = vertices.next().unwrap();
            ctx.move_to(first_vertex.x as f64, first_vertex.y as f64);
            for vertex in vertices {
                ctx.line_to(vertex.x as f64, vertex.y as f64);
            }
            ctx.close_path();
        },
        ColliderTrace::RegularStar(shape, draw_config) => {
            DrawConfig::from_object_draw_config(draw_config).apply_to_ctx(ctx);
            for i in 0..(shape.regular_polygon.sides * 2) {
                let mut angle = TAU * i as f64 / shape.regular_polygon.sides as f64;
                if shape.regular_polygon.sides == 4 {
                    angle += PI / 4.0;
                }
                let radius = shape.regular_polygon.circumradius() as f64;
                let factor = match i % 2 {
                    0 => shape.depth as f64,
                    _ => 1.0,
                };
                let x = angle.cos() * radius * factor;
                let y = angle.sin() * radius * factor;
                match i {
                    0 => ctx.move_to(x, y),
                    _ => ctx.line_to(x, y),
                }
            }
            ctx.close_path();
        },
        ColliderTrace::Compound(shapes) => {
            for (isometry, trace) in shapes {
                ctx.save();
                ctx.translate(isometry.0.x as f64, isometry.0.y as f64);
                ctx.rotate(isometry.1 as f64);
                trace_collider(ctx, trace);
                ctx.restore();
            }

            return;
        },
    }

    ctx.fill();
    ctx.stroke();
}