use bevy::{math::Vec2, utils::HashMap};
use web_sys::Path2d;

use crate::shared::util::{class::{ChildObjectConfig, ClassConfig}, drawinfo::DrawInfo, paint::Paint, shape::Shape};

use super::context::OffscreenContext;

#[derive(Clone, Copy, Default, PartialEq)]
struct AbsoluteTransform {
    pub translation: Vec2,
    pub rotation: f32,
    pub z_index: i32,
}

fn compute_absolute_transforms<'a>(
    parent_transform: AbsoluteTransform,
    object: &'a ChildObjectConfig,
    objects: &mut Vec<(&'a ChildObjectConfig, AbsoluteTransform)>
) {
    let current_transform = AbsoluteTransform {
        translation: parent_transform.translation + object.position.rotate(Vec2::from_angle(parent_transform.rotation)),
        rotation: match object.is_rotation_relative {
            true => parent_transform.rotation + object.rotation,
            false => object.rotation
        } + object.rotational_offset.unwrap_or_default(),
        z_index: match object.is_behind_parent {
            true => parent_transform.z_index - 1,
            false => parent_transform.z_index + 1
        } 
    };

    objects.push((object, current_transform));

    for child in &object.children {
        compute_absolute_transforms(current_transform, child, objects);
    }
}

fn render_object(ctx: &OffscreenContext, transform: AbsoluteTransform, shape: Option<&Shape>, draw_info: Option<&DrawInfo>) {
    ctx.save();
    ctx.translate(transform.translation.x as f64, transform.translation.y as f64).unwrap();
    ctx.rotate(transform.rotation as f64).unwrap();

    let (fill_paint, stroke_paint, stroke_width) = if let Some(draw_info) = draw_info {
        let fill_paint = draw_info.fill.unwrap_or(Paint::RGB(0, 0, 0));
        let (stroke_paint, stroke_width) = match draw_info.stroke {
            Some(stroke) => (
                stroke.paint.unwrap_or(fill_paint.blend_with(Paint::RGB(0, 0, 0), 0.4)), // TODO make configurable
                stroke.width,
            ),
            None => (Paint::RGB(0, 0, 0), 0.0),
        };
        (fill_paint, stroke_paint, stroke_width)
    } else {
        (Paint::RGB(0, 0, 0), Paint::RGB(0, 0, 0), 0.0)
    };

    ctx.set_fill_style(&fill_paint.into());
    ctx.set_stroke_style(&stroke_paint.into());
    ctx.set_line_width(stroke_width as f64);
    ctx.set_line_join("round");

    if let Some(shape) = shape {
        let path = Path2d::from(shape);
        ctx.fill_with_path_2d(&path);
        ctx.stroke_with_path(&path);
    }

    ctx.restore();
}

pub fn render_class(class: &ClassConfig, ctx: &OffscreenContext) {
    let mut objects: Vec<(&ChildObjectConfig, AbsoluteTransform)> = Vec::new();
    for child in &class.children {
        compute_absolute_transforms(AbsoluteTransform::default(), child, &mut objects);
    }
    objects.sort_by(|(_, a), (_, b)| a.z_index.cmp(&b.z_index));
    for (object, transform) in objects {
        render_object(&ctx, transform, object.shape.as_ref(), object.draw_info.as_ref());
    }
}