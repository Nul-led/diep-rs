use std::time::Duration;

use bevy::{
    app::{App, FixedUpdate, Plugin, RunMode, ScheduleRunnerPlugin, Startup, Update},
    diagnostic::SystemInformationDiagnosticsPlugin, ecs::{schedule::{Condition, IntoSystemConfigs, ScheduleLabel}, system::{Commands, IntoSystem, Local}},
};
use lightyear::{prelude::server::ServerCommands, server::plugin::ServerPlugins};

use crate::server::net::config::server_config;

use super::{health::HealthPlugin, routines::RoutinePlugin, test::TestPlugin};

pub struct ServerInitPlugin;

impl Plugin for ServerInitPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            #[cfg(not(feature = "client"))]
            ScheduleRunnerPlugin {
                run_mode: RunMode::Loop {
                    wait: Some(Duration::from_secs_f64(TICK_DURATION)),
                },
            },
            #[cfg(not(feature = "client"))]
            SystemInformationDiagnosticsPlugin,
            HealthPlugin,
            RoutinePlugin,
            TestPlugin,
            ServerPlugins::new(server_config()),
        ));

        app.add_systems(Startup, start_server);
    }
}

fn start_server(mut commands: Commands) {
    commands.start_server();
}