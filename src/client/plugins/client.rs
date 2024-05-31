use bevy::{a11y::AccessibilityPlugin, app::{App, Plugin, Startup, Update}, ecs::{entity::Entity, query::{Added, Without}, system::{Commands, Query}}, gilrs::GilrsPlugin, input::InputPlugin, transform::{components::GlobalTransform, TransformBundle}, window::{Window, WindowPlugin}, winit::WinitPlugin};
use bevy_xpbd_2d::components::{Position, Rotation};
use lightyear::{client::plugin::ClientPlugins, prelude::client::ClientCommands};

use crate::{client::net::config::client_config, shared::net::protocol::ProtocolPlugin};

use super::rendering::RenderingPlugin;

pub struct ClientInitPlugin;

impl Plugin for ClientInitPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
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
            RenderingPlugin,
            ClientPlugins::new(client_config()),
        ));

        app.add_systems(Startup, connect_client);
    }
}

fn connect_client(mut commands: Commands) {
    commands.connect_client();
}