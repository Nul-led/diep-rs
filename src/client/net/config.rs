use lightyear::{
    client::{
        config::{ClientConfig, NetcodeConfig},
        interpolation::plugin::{InterpolationConfig, InterpolationDelay},
    },
    connection::netcode::Key,
    prelude::client::{Authentication, ClientTransport, IoConfig, NetConfig},
};
use web_sys::js_sys::Math::random;

use crate::shared::{definitions::config::SERVER_ADDR, net::config::shared_config};

#[cfg(all(feature = "client", feature = "server"))]
const NET_CONFIG: NetConfig = NetConfig::Local { id: 0 };

#[cfg(not(all(feature = "client", feature = "server")))]
const NET_CONFIG: NetConfig = NetConfig::Netcode {
    auth: Authentication::Manual {
        client_id: (unsafe { random() } * f64::MAX).floor() as u64,
        server_addr: SERVER_ADDR,
        private_key: Key::default(),
        protocol_id: 0,
    },
    config: NetcodeConfig {
        client_timeout_secs: 300,
        ..Default::default()
    },
    io: IoConfig {
        transport: ClientTransport::WebSocketClient {
            server_addr: SERVER_ADDR,
        },
        ..Default::default()
    },
};

pub fn client_config() -> ClientConfig {
    ClientConfig {
        net: NET_CONFIG,
        shared: shared_config(),
        interpolation: InterpolationConfig {
            delay: InterpolationDelay {
                send_interval_ratio: 2.0,
                ..Default::default()
            },
        },
        ..Default::default()
    }
}
