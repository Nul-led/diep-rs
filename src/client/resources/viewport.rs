use bevy::{ecs::system::Resource, math::Vec2};
use web_sys::OffscreenCanvas;

use crate::client::utils::context::{Context, OffscreenContext};

struct Borders {
    pub min: Vec2,
    pub max: Vec2,
}

struct RenderConfig {

}

#[derive(Resource)]
pub struct Viewport {
    pub ctx: Context, // TODO request main canvas from js
    pub size: Vec2,
    pub zoom: f32,
    pub borders: Borders,
    pub grid_pattern_ctx: OffscreenContext
}

impl Viewport {
    pub fn new() {
        /* 
        Viewport {
            OffscreenContext::new_with_canvas(OffscreenCanvas::new(50, 50).unwrap()),
        }
        */
    }
}