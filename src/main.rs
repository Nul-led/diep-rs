use bevy::app::App;

#[cfg(feature = "client")]
mod client;

#[cfg(feature = "client")]
use client::plugins::client::ClientPlugin;

#[cfg(feature = "server")]
mod server;

#[cfg(feature = "server")]
use server::plugins::server::ServerPlugin;

mod shared;

fn main() {
    let mut app = App::new();

    #[cfg(feature = "client")]
    app.add_plugins(ClientPlugin);

    #[cfg(feature = "server")]
    app.add_plugins(ServerPlugin);

    app.run();
}