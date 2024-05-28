use bevy::{a11y::AccessibilityPlugin, app::{App, Plugin}, diagnostic::{Diagnostic, DiagnosticsPlugin, FrameTimeDiagnosticsPlugin, RegisterDiagnostic}, gilrs::GilrsPlugin, hierarchy::HierarchyPlugin, input::InputPlugin, log::LogPlugin, transform::TransformPlugin, window::{Window, WindowPlugin}, winit::WinitPlugin, MinimalPlugins};
use bevy_xpbd_2d::plugins::PhysicsPlugins;
use tracing::Level;

use super::rendering::RenderingPlugin;

pub struct ClientPlugin;

impl Plugin for ClientPlugin {
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
            InputPlugin,
            WindowPlugin {
                primary_window: Some(Window {
                    canvas: Some("#_app".to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            },
            AccessibilityPlugin,
            WinitPlugin::default(),
            GilrsPlugin,
            FrameTimeDiagnosticsPlugin,
            PhysicsPlugins::default(),
    
            RenderingPlugin,
    
            //ProtocolPlugin,
        ));

        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FPS).with_smoothing_factor(0.1));
        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_COUNT));
        app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_TIME));
    }
}