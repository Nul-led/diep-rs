#[cfg(feature = "client")]
mod client;
#[cfg(feature = "server")]
mod server;
mod shared;

fn main() {
    client::app::run();
}