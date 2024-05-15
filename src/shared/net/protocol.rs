



/*
Components:




Input:



Resources:


Messages:



Channels:


*/

use bevy::app::{App, Plugin};
use lightyear::{channel::builder::ChannelDirection, prelude::{AppComponentExt, AppMessageExt}};

use crate::shared::components::camera::PlayerId;

pub struct ProtocolPlugin;

impl Plugin for ProtocolPlugin {
    fn build(&self, app: &mut App) {
        app.register_component::<PlayerId>(ChannelDirection::ServerToClient);

    }
}