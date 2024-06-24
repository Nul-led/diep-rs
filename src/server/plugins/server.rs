use std::time::Duration;

use bevy::{
    app::{App, FixedUpdate, Plugin, RunMode, ScheduleRunnerPlugin, Startup, Update},
    diagnostic::SystemInformationDiagnosticsPlugin, ecs::{schedule::{Condition, IntoSystemConfigs, ScheduleLabel}, system::{Commands, IntoSystem, Local}},
};
use lightyear::{prelude::server::ServerCommands, server::plugin::ServerPlugins};

use crate::{server::{net::config::server_config, systems::routines::{system_orbit_routine, system_rotation_routine}}, shared::{definitions::config::TICK_DURATION, systems::test::{hierarchy_spawner, scaler, system_spawner, test_system}}};

use super::health::HealthPlugin;

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
            ServerPlugins::new(server_config()),
        ));

        app.add_systems(Startup, start_server);

        app.add_systems(Startup, (test_system, ));

        app.add_systems(FixedUpdate, (system_orbit_routine, system_rotation_routine, scaler,
            hierarchy_spawner.run_if(under()),
            //system_spawner.run_if(under()),
        ));
    }
}

fn under() -> impl Condition<()> {
    IntoSystem::into_system(|mut flag: Local<usize>| {
        *flag += 1;
        *flag <= 100
    })
}

fn start_server(mut commands: Commands) {
    commands.start_server();
}