use std::time::Duration;

use bevy::{
    app::{App, FixedUpdate, Plugin, RunMode, ScheduleRunnerPlugin, Startup, Update},
    diagnostic::SystemInformationDiagnosticsPlugin, ecs::system::Commands,
};
use lightyear::{prelude::server::ServerCommands, server::plugin::ServerPlugins};

use crate::{server::{net::config::server_config, systems::routines::{system_orbit_routine, system_rotation_routine}}, shared::{definitions::config::TICK_DURATION, systems::test::{test_system}}};

pub struct ServerInitPlugin;

impl Plugin for ServerInitPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            ScheduleRunnerPlugin {
                run_mode: RunMode::Loop {
                    wait: Some(Duration::from_secs_f64(TICK_DURATION)),
                },
            },
            SystemInformationDiagnosticsPlugin,
            ServerPlugins::new(server_config()),
        ));

        app.add_systems(Startup, start_server);

        app.add_systems(Startup, test_system);

        app.add_systems(FixedUpdate, (system_orbit_routine, system_rotation_routine));
    }
}


fn start_server(mut commands: Commands) {
    commands.start_server();
}