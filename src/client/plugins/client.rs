use bevy::{a11y::AccessibilityPlugin, app::{App, Plugin, Startup, Update}, ecs::{entity::Entity, query::{Added, Without}, schedule::States, system::{Commands, Query}}, gilrs::GilrsPlugin, input::InputPlugin, transform::{components::GlobalTransform, TransformBundle}, window::{Window, WindowPlugin}, winit::WinitPlugin};
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

        app.init_state::<ScreenState>();

        app.add_systems(Startup, connect_client);
    }
}

#[derive(States, Clone, Copy, Debug, Default, Hash, PartialEq, Eq)]
pub enum ScreenState {
    #[default]
    TitleScreen,
    Playing,
    PlayerStats,
    Respawn,
    Menu,
}

fn connect_client(mut commands: Commands) {
    commands.connect_client();
}