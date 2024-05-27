use std::time::Duration;

use lightyear::shared::{config::{Mode, SharedConfig}, tick_manager::TickConfig};

pub const FIXED_TIMESTEP_HZ: f64 = 25.0;

pub fn shared_config(mode: Mode) -> SharedConfig {
    SharedConfig {
        client_send_interval: Duration::default(),
        server_send_interval: Duration::from_millis(40),
        tick: TickConfig {
            tick_duration: Duration::from_secs_f64(1.0 / FIXED_TIMESTEP_HZ)
        },
        mode,
    }
}