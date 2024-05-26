use bevy::{app::{App, Plugin, Startup, Update}, ecs::schedule::IntoSystemConfigs};

use crate::client::{resources::viewport::Viewport, systems::{rendering::{system_render_borders, system_render_grid, system_render_indicators, system_render_objects}, test::test_system, viewport::{system_apply_camera, system_revert_camera, system_sync_viewport}}, web};



pub struct RenderingPlugin;


impl Plugin for RenderingPlugin {
    fn build(&self, app: &mut App) {
        
        app.insert_resource(Viewport::new());

        app.add_systems(Update, (
            web::Viewport::system_viewport_start_frame,
            system_sync_viewport,
            system_render_grid,
            system_render_borders,
            system_apply_camera,
            system_render_objects,
            system_render_indicators,
            system_revert_camera,
            web::Viewport::system_viewport_render_components,
            web::Viewport::system_viewport_end_frame,
        ).chain());


        app.add_systems(Startup, test_system);
        
    }
}

