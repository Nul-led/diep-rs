use bevy::{
    ecs::{
        entity::Entity,
        system::{Query, Res, ResMut},
    }, math::Vec2, transform::components::GlobalTransform, ui::ZIndex
};
use bevy_xpbd_2d::components::{Position, Rotation};
use wasm_bindgen::JsValue;
use web_sys::{OffscreenCanvas, Path2d};

use crate::{
    client::{
        resources::viewport::Viewport,
        utils::context::{Context, OffscreenContext},
    },
    shared::{
        components::{
            camera::{Camera, CameraMode},
            game::GameMapInfo,
            indicator::{IndicatorConfig, IndicatorPosition},
            object::{
                ObjectDamageMarker, ObjectDrawInfo, ObjectInvincibilityMarker, ObjectName,
                ObjectOpacity, ObjectScore, ObjectShape, ObjectZIndex,
            },
        },
        definitions::colors::Colors,
        util::{drawinfo::Stroke, paint::Paint},
    },
};

/// Renders entities, names, scores and healthbar
pub fn render_objects(
    q_object_z_index: Query<(Entity, &ObjectZIndex)>,
    q_objects: Query<(
        &GlobalTransform,
        Option<&ObjectName>,
        Option<&ObjectScore>,
        Option<&ObjectOpacity>,
        Option<&ObjectShape>,
        Option<&ObjectDrawInfo>,
        Option<&ObjectDamageMarker>,
        Option<&ObjectInvincibilityMarker>,
        // TODO cannon
    )>,
    r_viewport: Res<Viewport>,
) {
    let mut object_entities: Vec<(Entity, &ObjectZIndex)> = q_object_z_index.iter().collect();
    object_entities.sort_by(|a, b| a.1 .0.cmp(&b.1 .0));

    for (entity, _) in object_entities {
        if let Ok((
            transform,
            name,
            score,
            opacity,
            shape,
            draw_info,
            damage_marker,
            invincibility_marker,
        )) = q_objects.get(entity)
        {
            let pos = Position::from(transform);
            let rot = Rotation::from(transform);

            r_viewport.ctx.save();

            r_viewport.ctx.translate(pos.x as f64, pos.y as f64).unwrap();
            r_viewport.ctx.rotate(rot.as_radians() as f64).unwrap();
            
            if let Some(opacity) = opacity {
                r_viewport.ctx.set_global_alpha(opacity.0 as f64);
            }

            let (fill_paint, stroke_paint, stroke_width) = if let Some(draw_info) = draw_info {
                let fill_paint = draw_info.0.fill.unwrap_or(Paint::RGB(0, 0, 0));
                let (stroke_paint, stroke_width) = match draw_info.0.stroke {
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

            r_viewport.ctx.set_fill_style(&fill_paint.into());
            r_viewport.ctx.set_stroke_style(&stroke_paint.into());
            r_viewport.ctx.set_line_width(stroke_width as f64);
            r_viewport.ctx.set_line_join("round");

            if let Some(shape) = shape {
                let path = Path2d::from(&shape.0);
                r_viewport.ctx.fill_with_path_2d(&path);
                r_viewport.ctx.stroke_with_path(&path);
            }
            
            r_viewport.ctx.restore();
        }
    }
}

//pub fn render_object

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
            r_viewport
                .grid_pattern_ctx
                .set_fill_style(&Paint::from(Colors::Gray5).into());
            r_viewport
                .grid_pattern_ctx
                .set_stroke_style(&Paint::from(Colors::Black).into());
            r_viewport
                .grid_pattern_ctx
                .set_global_alpha(0.1 * r_viewport.zoom as f64); // TODO grid base alpha cfg
            r_viewport
                .grid_pattern_ctx
                .set_line_width(1.0 / r_viewport.zoom as f64);
            r_viewport.grid_pattern_ctx.fill_rect(0.0, 0.0, 50.0, 50.0);
            r_viewport.grid_pattern_ctx.begin_path();
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(0.5, 50.5);
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(50.5, 0.5);
            r_viewport.grid_pattern_ctx.stroke();

            if let Ok(pattern) = r_viewport.ctx.create_pattern_with_offscreen_canvas(
                &r_viewport.grid_pattern_ctx.canvas(),
                "repeat",
            ) {
                if let Some(pattern) = pattern {
                    r_viewport
                        .ctx
                        .scale(r_viewport.zoom as f64, r_viewport.zoom as f64)
                        .unwrap();
                    r_viewport
                        .ctx
                        .translate(offset.x as f64 - 50.0, offset.y as f64 - 50.0)
                        .unwrap();
                    r_viewport.ctx.set_fill_style(&pattern);
                    r_viewport.ctx.fill_rect(
                        0.0,
                        0.0,
                        (r_viewport.size.x / r_viewport.zoom) as f64 + 50.0,
                        (r_viewport.size.y / r_viewport.zoom) as f64 + 50.0,
                    );
                }
            }
        }
    }

    r_viewport.ctx.restore();
}

pub fn render_borders(q_game: Query<(&GameMapInfo)>, mut r_viewport: ResMut<Viewport>) {
    if let Ok(map_info) = q_game.get_single() {
        r_viewport.borders.min = (r_viewport.borders.min * 4.0 - map_info.size / 2.0) / 5.0;
        r_viewport.borders.max = (r_viewport.borders.max * 4.0 + map_info.size / 2.0) / 5.0;

        let screen_min = Vec2::ZERO.max(r_viewport.to_screen_pos(r_viewport.borders.min));
        let screen_max = Vec2::ZERO.min(r_viewport.to_screen_pos(r_viewport.borders.max));

        r_viewport.ctx.save();
        r_viewport.ctx.set_global_alpha(0.1); // TODO make configurable
        r_viewport
            .ctx
            .set_fill_style(&Paint::from(Colors::Black).into());

        r_viewport.ctx.fill_rect(
            0.0,
            screen_min.y as f64,
            screen_min.x as f64,
            (r_viewport.size.y - screen_min.y) as f64,
        );
        r_viewport
            .ctx
            .fill_rect(0.0, 0.0, screen_max.x as f64, screen_min.y as f64);
        r_viewport.ctx.fill_rect(
            screen_min.x as f64,
            0.0,
            (r_viewport.size.x - screen_max.x) as f64,
            screen_max.y as f64,
        );
        r_viewport.ctx.fill_rect(
            screen_min.x as f64,
            screen_max.y as f64,
            (r_viewport.size.x - screen_min.x) as f64,
            (r_viewport.size.y - screen_max.y) as f64,
        );

        r_viewport.ctx.restore();
    }
}

pub fn render_indicators(
    q_game: Query<(&IndicatorConfig, &IndicatorPosition)>,
    mut r_viewport: ResMut<Viewport>,
) {
}
