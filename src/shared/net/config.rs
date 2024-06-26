use std::time::Duration;

use lightyear::shared::{config::SharedConfig, tick_manager::TickConfig};

use crate::shared::definitions::config::{SERVER_MODE, TICK_DURATION};

pub fn shared_config() -> SharedConfig {
    SharedConfig {
        tick: TickConfig {
            tick_duration: Duration::from_secs_f64(TICK_DURATION)
        },
        mode: SERVER_MODE,
        server_replication_send_interval: Duration::default(),
    }
}