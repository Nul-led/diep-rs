use bevy::{math::Vec2, utils::HashMap};
use web_sys::Path2d;

use crate::shared::util::{class::{ChildObjectConfig, ClassConfig}, drawinfo::DrawConfig, paint::Paint, shape::ColliderTrace};

use super::{context::OffscreenContext, shapes::trace_collider};

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

fn render_object(ctx: &OffscreenContext, transform: AbsoluteTransform, collider: &Option<ColliderTrace>) {
    ctx.save();
    ctx.translate(transform.translation.x as f64, transform.translation.y as f64).unwrap();
    ctx.rotate(transform.rotation as f64).unwrap();

    if let Some(trace) = collider {
        trace_collider(&ctx.into(), trace);
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
        render_object(&ctx, transform, &class.collider);
    }
}