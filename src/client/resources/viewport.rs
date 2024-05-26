use bevy::{ecs::system::Resource, math::Vec2};

use crate::client::{utils::context::{Context, OffscreenContext}, web};


#[derive(Clone, Copy, Default, PartialEq)]
pub struct MapBorders {
    pub min: Vec2,
    pub max: Vec2,
}

struct RenderConfig {

}

#[derive(Resource)]
pub struct Viewport {
    pub ctx: Context, // TODO request main canvas from js
    pub size: Vec2,
    pub zoom: f32, // lerp(fov * ssz)
    pub offset: Vec2, // cam pos
    pub borders: MapBorders,
    pub grid_pattern_ctx: OffscreenContext
}

impl Viewport {
    pub fn new() -> Viewport {
        Viewport {
            ctx: Context(web::Viewport::get_ctx()),
            size: Vec2::new(web::Viewport::viewport_width(), web::Viewport::viewport_height()),
            zoom: 0.55 * web::Viewport::gui_zoom_factor(),
            offset: Vec2::default(),
            borders: MapBorders::default(),
            grid_pattern_ctx: OffscreenContext::new(),
        }
    }

    pub fn to_screen_x(&self, v: f32) -> f32 {
        (v - self.offset.x / 2.0) * self.zoom + self.size.x
    }
    
    pub fn to_screen_y(&self, v: f32) -> f32 {
        (v - self.offset.y / 2.0) * self.zoom + self.size.y
    }
    
    pub fn to_game_x(&self, v: f32) -> f32 {
        (v - self.size.x / 2.0) / self.zoom + self.offset.x
    }
    
    pub fn to_game_y(&self, v: f32) -> f32 {
        (v - self.size.y / 2.0) / self.zoom + self.offset.y
    }

    pub fn to_screen_pos(&self, v: Vec2) -> Vec2 {
        (v - self.offset / 2.0) * self.zoom + self.size
    }

    pub fn to_game_pos(&self, v: Vec2) -> Vec2 {
        (v - self.size / 2.0) / self.zoom + self.offset
    }
}