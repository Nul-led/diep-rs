use bevy::{app::{App, Plugin, PostUpdate, Startup, Update}, ecs::schedule::IntoSystemConfigs};
use lightyear::client::{interpolation::plugin::InterpolationSet, prediction::plugin::PredictionSet};

use crate::client::{resources::viewport::Viewport, systems::{appinfo::system_update_app_info, rendering::{system_render_borders, system_render_grid, system_render_indicators, system_render_objects}, viewport::{system_apply_camera, system_revert_camera, system_sync_viewport}}, web};

pub struct RenderingPlugin;


impl Plugin for RenderingPlugin {
    fn build(&self, app: &mut App) {
        
        app.insert_resource(Viewport::new());

        app.add_systems(Update, (
            web::Viewport::system_viewport_start_frame,
            system_sync_viewport,
            system_update_app_info,
        ).chain());

        app.add_systems(PostUpdate, (
            system_render_grid,
            //system_render_borders,
            system_apply_camera,
            system_render_objects,
            //system_render_indicators,
            system_revert_camera,
            web::Viewport::system_viewport_render_components,
            web::Viewport::system_viewport_end_frame,
        ).chain().after(InterpolationSet::Interpolate).after(PredictionSet::VisualCorrection));

        //app.add_systems(Startup, test_system);
        //app.add_systems(Update, test_system1);
        
    }
}

