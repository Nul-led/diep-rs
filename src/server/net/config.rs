use lightyear::{prelude::server::{IoConfig, NetConfig, ServerTransport}, server::config::{NetcodeConfig, ServerConfig}};

use crate::shared::{definitions::config::SERVER_ADDR, net::config::shared_config};

pub fn server_config() -> ServerConfig {
    ServerConfig {
        net: vec![NetConfig::Netcode {
            config: NetcodeConfig {
                client_timeout_secs: 300,
                ..Default::default()
            },
            io: IoConfig {
                transport: ServerTransport::WebSocketServer { server_addr: SERVER_ADDR },
                ..Default::default()
            }
        }],
        shared: shared_config(),
        ..Default::default()
    }
}