use lightyear::{client::config::{ClientConfig, NetcodeConfig}, connection::netcode::Key, prelude::client::{Authentication, ClientTransport, IoConfig, NetConfig}};
use web_sys::js_sys::Math::random;

use crate::shared::{definitions::config::SERVER_ADDR, net::config::shared_config};

pub fn client_config() -> ClientConfig {
    ClientConfig {
        net: NetConfig::Netcode {
            auth: Authentication::Manual {
                client_id: (random() * f64::MAX).floor() as u64,
                server_addr: SERVER_ADDR,
                private_key: Key::default(),
                protocol_id: 0,
            },
            config: NetcodeConfig {
                client_timeout_secs: 300,
                ..Default::default()
            },
            io: IoConfig {
                transport: ClientTransport::WebSocketClient { server_addr: SERVER_ADDR },
                ..Default::default()
            }
        },
        shared: shared_config(),
        ..Default::default()
    }
}
