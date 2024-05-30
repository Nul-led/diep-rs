use bevy::{app::{App, Plugin, Startup, Update}, core::{FrameCountPlugin, TaskPoolPlugin, TypeRegistrationPlugin}, diagnostic::{DiagnosticsPlugin, EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin}, hierarchy::HierarchyPlugin, log::LogPlugin, time::TimePlugin, transform::TransformPlugin};
use bevy_xpbd_2d::plugins::PhysicsPlugins;
use tracing::Level;

use crate::shared::systems::test::{test_system, test_system1};

pub struct SharedInitPlugin;

impl Plugin for SharedInitPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            TaskPoolPlugin::default(),
            TypeRegistrationPlugin,
            FrameCountPlugin,
            TimePlugin,
            LogPlugin {
                level: Level::DEBUG,
                ..Default::default()
            },
            TransformPlugin,
            HierarchyPlugin,
            DiagnosticsPlugin,
            FrameTimeDiagnosticsPlugin,
            EntityCountDiagnosticsPlugin,
            PhysicsPlugins::default(),
        ));
    }
}