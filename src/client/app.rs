use std::{mem, sync::{Arc, RwLock}, time::Instant};

use bevy::{a11y::AccessibilityPlugin, app::{App, Main, Plugin, ScheduleRunnerPlugin, Startup, Update}, diagnostic::{Diagnostic, DiagnosticsPlugin, FrameTimeDiagnosticsPlugin, RegisterDiagnostic}, ecs::{system::{Query, Resource, RunSystemOnce}, world::World}, gilrs::GilrsPlugin, hierarchy::HierarchyPlugin, input::InputPlugin, log::LogPlugin, text::{Text, Text2dBundle}, transform::TransformPlugin, window::{Window, WindowPlugin}, winit::WinitPlugin, MinimalPlugins};
use tracing::{info, Level};
use wasm_bindgen::{closure::Closure, JsCast, JsValue};
use web_sys::{js_sys::Array, window, Blob, Url, VisibilityState, Worker};

use crate::shared::net::protocol::ProtocolPlugin;

pub fn run() {
    let mut app = App::new();

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


        //ProtocolPlugin,
    ));
    
    app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FPS).with_smoothing_factor(0.1));
    app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_COUNT));
    app.register_diagnostic(Diagnostic::new(FrameTimeDiagnosticsPlugin::FRAME_TIME));

    app.run();
}