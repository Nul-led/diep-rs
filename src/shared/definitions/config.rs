use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use lightyear::shared::config::Mode;

pub const TICKS_PER_SECOND: f64 = 25.0;

pub const TICK_DURATION: f64 = 1.0 / TICKS_PER_SECOND;

#[cfg(all(feature = "client", feature = "server"))]
pub const SERVER_MODE: Mode = Mode::HostServer;

#[cfg(not(all(feature = "client", feature = "server")))]
pub const SERVER_MODE: Mode = Mode::Separate;

pub const CLIENT_ADDR: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 4000);

pub const SERVER_ADDR: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 5000);
