use bevy::{a11y::AccessibilityPlugin, app::{App, Plugin, Startup, Update}, ecs::{entity::Entity, query::Added, system::{Commands, Query}}, gilrs::GilrsPlugin, input::InputPlugin, transform::{components::GlobalTransform, TransformBundle}, window::{Window, WindowPlugin}, winit::WinitPlugin};
use bevy_xpbd_2d::components::Position;
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
        app.add_systems(Update, pos_system);
    }
}

fn connect_client(mut commands: Commands) {
    commands.connect_client();
}

fn pos_system(mut commands: Commands, q_new_obj: Query<Entity, Added<GlobalTransform>>) {
    for entity in q_new_obj.iter() {
        //commands.entity(entity).insert(TransformBundle::default());
    }
}