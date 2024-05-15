use bevy::{
    ecs::system::{Query, Res},
    math::Vec2,
};
use bevy_xpbd_2d::components::Position;
use wasm_bindgen::JsValue;
use web_sys::OffscreenCanvas;

use crate::{
    client::{
        resources::viewport::Viewport,
        utils::context::{Context, OffscreenContext},
    },
    shared::{
        components::camera::{Camera, CameraMode},
        definitions::colors::Colors,
        util::paint::Paint,
    },
};

/// Renders entities, names, scores and healthbar
pub fn render_objects(q_shapes: Query<()>, r_viewport: Res<Viewport>) {}

pub fn render_grid(
    q_camera: Query<&Camera>,
    q_position: Query<&Position>,
    r_viewport: Res<Viewport>,
) {
    r_viewport.ctx.save();

    if true
    /* TODO toggles.background */
    {
        r_viewport
            .ctx
            .set_fill_style(&Paint::from(Colors::Gray5).into());
        r_viewport
            .ctx
            .fill_rect(0.0, 0.0, r_viewport.size.x as f64, r_viewport.size.y as f64);
        // TODO screenW, screenH as args
    }

    if true
    /* TODO toggles.grid */
    {
        if let Ok(camera) = q_camera.get_single() {
            let cam_pos = match camera.mode {
                CameraMode::Absolute { target } => target,
                CameraMode::Relative { target, .. } => {
                    q_position.get(target).unwrap_or(&Position::default()).0
                }
            };

             // TODO make grid size configurable

            let offset =
                (((r_viewport.size / 2.0 / r_viewport.zoom - cam_pos) % 50.0) + 50.0) % 50.0;

            r_viewport.grid_pattern_ctx.reset();
            r_viewport.grid_pattern_ctx.set_fill_style(&Paint::from(Colors::Gray5).into());
            r_viewport.grid_pattern_ctx.set_stroke_style(&Paint::from(Colors::Black).into());
            r_viewport.grid_pattern_ctx.set_global_alpha(0.1 * r_viewport.zoom as f64); // TODO grid base alpha cfg
            r_viewport.grid_pattern_ctx.set_line_width(1.0 / r_viewport.zoom as f64);
            r_viewport.grid_pattern_ctx.fill_rect(0.0, 0.0, 50.0, 50.0);
            r_viewport.grid_pattern_ctx.begin_path();
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(0.5, 50.5);
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(50.5, 0.5);
            r_viewport.grid_pattern_ctx.stroke();

            if let Ok(pattern) = r_viewport.ctx.create_pattern_with_offscreen_canvas(&r_viewport.grid_pattern_ctx.canvas(), "repeat") {
                if let Some(pattern) = pattern {
                    r_viewport.ctx.scale(r_viewport.zoom as f64, r_viewport.zoom as f64).unwrap();
                    r_viewport.ctx.translate(offset.x as f64 - 50.0, offset.y as f64 - 50.0).unwrap();
                    r_viewport.ctx.set_fill_style(&pattern);
                    r_viewport.ctx.fill_rect(0.0, 0.0, (r_viewport.size.x / r_viewport.zoom) as f64 + 50.0, (r_viewport.size.y / r_viewport.zoom) as f64 + 50.0);
                }
            }
        }
    }

    r_viewport.ctx.restore();
}

pub fn render_borders(
    r_viewport: Res<Viewport>,
) {
    
}