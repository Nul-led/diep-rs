use bevy::{a11y::AccessibilityPlugin, app::{App, Plugin, Startup}, ecs::system::Commands, gilrs::GilrsPlugin, input::InputPlugin, window::{Window, WindowPlugin}, winit::WinitPlugin};
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