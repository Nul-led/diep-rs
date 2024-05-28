use bevy::{app::{App, Plugin}, diagnostic::{Diagnostic, DiagnosticsPlugin, FrameTimeDiagnosticsPlugin, RegisterDiagnostic}, hierarchy::HierarchyPlugin, log::LogPlugin, transform::TransformPlugin, MinimalPlugins};
use bevy_xpbd_2d::plugins::PhysicsPlugins;
use tracing::Level;

pub struct ServerPlugin;

impl Plugin for ServerPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            MinimalPlugins,
            LogPlugin {
                level: Level::DEBUG,
                ..Default::default()
            },
            TransformPlugin,
            HierarchyPlugin::default(),
            DiagnosticsPlugin,
            FrameTimeDiagnosticsPlugin,
            PhysicsPlugins::default(),
        ));

        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FPS).with_smoothing_factor(0.1));
        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_COUNT));
        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_TIME));
    }
}