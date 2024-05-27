
use bevy::{
    ecs::{
        entity::Entity,
        system::{Query, Res, ResMut},
    }, math::Vec2, transform::components::GlobalTransform
};
use bevy_xpbd_2d::{components::{Position, Rotation}, plugins::collision::{AnyCollider, Collider}};
use tracing::info;
use web_sys::Path2d;

use crate::{
    client::{
        resources::viewport::Viewport,
        utils::prettify::prettify_number,
    },
    shared::{
        components::{
            camera::{Camera, CameraMode},
            game::GameMapInfo,
            indicator::{IndicatorConfig, IndicatorPosition},
            object::{
                ObjectDamageMarker, ObjectDrawInfo, ObjectHealth, ObjectInvincibilityMarker, ObjectName, ObjectOpacity, ObjectScore, ObjectShape, ObjectZIndex
            },
        },
        definitions::colors::Colors,
        util::paint::Paint,
    },
};

/// Renders entities, names, scores and healthbar
pub fn system_render_objects(
    q_object_z_index: Query<(Entity, &ObjectZIndex)>,
    q_objects: Query<(
        &GlobalTransform,
        Option<&Collider>,
        Option<&ObjectName>,
        Option<&ObjectScore>,
        Option<&ObjectOpacity>,
        Option<&ObjectShape>,
        Option<&ObjectDrawInfo>,
        Option<&ObjectHealth>,
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
            collider,
            name,
            score,
            opacity,
            shape,
            draw_info,
            health,
            damage_marker,
            invincibility_marker,
        )) = q_objects.get(entity)
        {
            let pos = Position::from(transform);
            let rot = Rotation::from(transform);

            r_viewport.ctx.save();

            r_viewport.ctx.translate(pos.x as f64, pos.y as f64).unwrap();

            if let Some(opacity) = opacity {
                r_viewport.ctx.set_global_alpha(opacity.0 as f64);
            }

            r_viewport.ctx.save();

            r_viewport.ctx.rotate(rot.as_radians() as f64).unwrap();

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
                let size = if let Some(collider) = collider {
                    let scale = collider.scale();
                    r_viewport.ctx.scale(scale.x as f64, scale.y as f64).unwrap();
                    collider.aabb(pos.0, 0.0).size()
                } else {
                    let collider = Collider::from(&shape.0);
                    collider.aabb(pos.0, 0.0).size()
                };

                let path = Path2d::from(&shape.0);
                r_viewport.ctx.fill_with_path_2d(&path);
                r_viewport.ctx.stroke_with_path(&path);

                r_viewport.ctx.restore();

                r_viewport.ctx.set_stroke_style(&Paint::RGB(0, 0, 0).into());
                r_viewport.ctx.stroke_rect((-size.x / 2.0) as f64, (-size.y / 2.0) as f64, size.x as f64, size.y as f64);

                r_viewport.ctx.set_text_align("center");
                r_viewport.ctx.set_text_baseline("middle");

                let offset = if let Some(score) = score {
                    let font_size = size.max_element() / 2.0 / 50.0 * 25.0;
                    r_viewport.ctx.set_font(&format!("{}px Ubuntu", font_size));
                    let txt = prettify_number(score.score, 1);
 
                    if let Some(draw_info) = score.draw_info {
                        if let Some(stroke) = draw_info.stroke {
                            r_viewport.ctx.set_stroke_style(&stroke.paint.unwrap_or(Paint::RGB(0, 0, 0)).into());
                            r_viewport.ctx.set_line_width((font_size * stroke.width) as f64);
                            r_viewport.ctx.stroke_text(&txt, 0.0, (size.y / 2.0 * -1.5) as f64).unwrap();
                        }

                        if let Some(fill) = draw_info.fill {
                            r_viewport.ctx.set_fill_style(&fill.into());
                            r_viewport.ctx.fill_text(&txt, 0.0, (size.y / 2.0 * -1.5) as f64).unwrap();
                        }
                    }
                    (font_size * 1.4).max(0.0)
                } else { 0.0 };

                if let Some(name) = name {
                    let font_size = size.max_element() / 2.0 / 50.0 * 40.0;
                    r_viewport.ctx.set_font(&format!("{}px Ubuntu", font_size));
                    
                    if let Some(draw_info) = name.draw_info {
                        if let Some(stroke) = draw_info.stroke {
                            r_viewport.ctx.set_stroke_style(&stroke.paint.unwrap_or(Paint::RGB(0, 0, 0)).into());
                            r_viewport.ctx.set_line_width((font_size * stroke.width) as f64);
                            r_viewport.ctx.stroke_text(&name.name, 0.0, (size.y / 2.0 * -1.5 - offset) as f64).unwrap();
                        }

                        if let Some(fill) = draw_info.fill {
                            r_viewport.ctx.set_fill_style(&fill.into());
                            r_viewport.ctx.fill_text(&name.name, 0.0, (size.y / 2.0 * -1.5 - offset) as f64).unwrap();
                        }
                    }
                }

                if let Some(health) = health {
                    if health.max_health != health.health {
                        let perc = (health.health / health.max_health).clamp(0.0, 1.0);

                        r_viewport.ctx.translate((-size.x / 2.0) as f64, (size.y / 2.0 + 35.0) as f64).unwrap();

                        r_viewport.ctx.set_line_cap("round");
                        r_viewport.ctx.set_line_width(16.0);
                        r_viewport.ctx.begin_path();
                        r_viewport.ctx.move_to(8.0, 8.0);
                        r_viewport.ctx.line_to(size.x as f64, 8.0); // TODO check if i need to size.x - 8.0
                        r_viewport.ctx.set_stroke_style(&Paint::RGB(0, 0, 0).into()); // TODO configurable
                        r_viewport.ctx.stroke();
                        r_viewport.ctx.set_line_width(16.0 * 0.75);
                        r_viewport.ctx.begin_path();
                        r_viewport.ctx.move_to(8.0, 8.0);
                        r_viewport.ctx.line_to(8.0_f32.max(size.x * perc) as f64, 8.0);
                        r_viewport.ctx.set_stroke_style(&health.custom_healthbar_color.unwrap_or(Paint::RGB(133, 227, 125)).into());
                        r_viewport.ctx.stroke();

                        // TODO health text
                    }
                }
            }
            
            r_viewport.ctx.restore();
        }
    }
}

pub fn system_render_grid(
    q_camera: Query<&Camera>,
    q_position: Query<&Position>,
    q_game: Query<&GameMapInfo>,
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
        let grid_size = q_game.get_single().and_then(|m| Ok(m.grid_size)).unwrap_or(50);
        
        if let Ok(camera) = q_camera.get_single() {
            let cam_pos = match camera.mode {
                CameraMode::Absolute { target } => target,
                CameraMode::Relative { target, .. } => {
                    q_position.get(target).unwrap_or(&Position::default()).0
                }
            };

            // TODO make grid size configurable

            let offset =
                (((r_viewport.size / 2.0 / r_viewport.zoom - cam_pos) % grid_size as f32) + grid_size as f32) % grid_size as f32;

            r_viewport.grid_pattern_ctx.reset();
            let canvas = r_viewport.grid_pattern_ctx.canvas();
            canvas.set_width(grid_size);
            canvas.set_height(grid_size);
            r_viewport
                .grid_pattern_ctx
                .set_fill_style(&Paint::from(Colors::Gray5).into());
            r_viewport.grid_pattern_ctx.fill_rect(0.0, 0.0, grid_size as f64, grid_size as f64);
            r_viewport
                .grid_pattern_ctx
                .set_stroke_style(&Paint::from(Colors::Black).into());
            r_viewport
                .grid_pattern_ctx
                .set_global_alpha(0.1 * r_viewport.zoom as f64); // TODO grid base alpha cfg
            r_viewport
                .grid_pattern_ctx
                .set_line_width(1.0 / r_viewport.zoom as f64);
            r_viewport.grid_pattern_ctx.begin_path();
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(0.5, grid_size as f64 + 0.5);
            r_viewport.grid_pattern_ctx.move_to(0.5, 0.5);
            r_viewport.grid_pattern_ctx.line_to(grid_size as f64 + 0.5, 0.5);
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
                        .translate((offset.x - grid_size as f32) as f64, (offset.y - grid_size as f32) as f64)
                        .unwrap();
                    r_viewport.ctx.set_fill_style(&pattern);
                    r_viewport.ctx.fill_rect(
                        0.0,
                        0.0,
                        (r_viewport.size.x / r_viewport.zoom + grid_size as f32) as f64,
                        (r_viewport.size.y / r_viewport.zoom + grid_size as f32) as f64,
                    );
                }
            }
        }
    }

    r_viewport.ctx.restore();
}

pub fn system_render_borders(q_game: Query<(&GameMapInfo)>, mut r_viewport: ResMut<Viewport>) {
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

pub fn system_render_indicators(
    q_game: Query<(&IndicatorConfig, &IndicatorPosition)>,
    mut r_viewport: ResMut<Viewport>,
) {
}
