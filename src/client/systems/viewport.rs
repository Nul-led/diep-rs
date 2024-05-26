use bevy::{ecs::system::{Query, Res, ResMut}, math::Vec2, transform::components::GlobalTransform};
use bevy_xpbd_2d::components::Position;

use crate::{client::{resources::viewport::Viewport, web}, shared::components::camera::{Camera, CameraMode}};

pub fn system_sync_viewport(mut r_viewport: ResMut<Viewport>, q_camera: Query<&Camera>, q_transform: Query<&GlobalTransform>) {
    r_viewport.size = Vec2::new(web::Viewport::viewport_width(), web::Viewport::viewport_height());
    if let Ok(camera) = q_camera.get_single() {
        let wanted = camera.fov * web::Viewport::gui_zoom_factor();
        r_viewport.zoom = (r_viewport.zoom * 9.0 + wanted) / 10.0;
        r_viewport.offset = match camera.mode {
            CameraMode::Absolute { target } => target,
            CameraMode::Relative { target, movement_speed } => {
                if let Ok(transform) = q_transform.get(target) {
                    // TODO extrapolation + interpolation
                    Position::from(transform).0
                } else {
                    Vec2::ZERO
                }
            }
        };
        
    } else {
        r_viewport.zoom = 0.55 * web::Viewport::gui_zoom_factor();
        r_viewport.offset = Vec2::ZERO;
    }
}


pub fn system_apply_camera(r_viewport: Res<Viewport>) {
    r_viewport.ctx.save();

    r_viewport.ctx.translate(r_viewport.size.x as f64 / 2.0, r_viewport.size.y as f64 / 2.0).unwrap();
    r_viewport.ctx.scale(r_viewport.zoom as f64, r_viewport.zoom as f64).unwrap();
    r_viewport.ctx.translate(-r_viewport.offset.x as f64, -r_viewport.offset.y as f64).unwrap();
}

pub fn system_revert_camera(r_viewport: Res<Viewport>) {
    r_viewport.ctx.restore();
}