use bevy::app::App;
use shared::{net::protocol::ProtocolPlugin, plugins::shared::SharedInitPlugin};

#[cfg(feature = "client")]
mod client;

#[cfg(feature = "server")]
mod server;

mod shared;

fn main() {
    let mut app = App::new();

    app.add_plugins(SharedInitPlugin);


    #[cfg(feature = "server")] {
        app.add_plugins(server::plugins::server::ServerInitPlugin);
    }

    #[cfg(feature = "client")] {
        app.add_plugins(client::plugins::client::ClientInitPlugin);
    }

    app.add_plugins(ProtocolPlugin);

    app.run();
}