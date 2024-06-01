



/*
Components:




Input:



Resources:


Messages:



Channels:


*/

use bevy::{app::{App, Plugin}, transform::components::GlobalTransform};
use bevy_xpbd_2d::{components::{AngularDamping, AngularVelocity, LinearDamping, LinearVelocity, Position, RigidBody, Rotation}, plugins::collision::Collider};
use lightyear::{channel::builder::ChannelDirection, client::components::ComponentSyncMode, prelude::{AppComponentExt, AppMessageExt}, utils::bevy_xpbd_2d::{position, rotation}};

use crate::shared::components::{camera::{AvailableClasses, Camera, ConsoleCommands, PlayerId, PlayerStats, PlayerStatus, RenderToggles}, game::{GameLobbyInfo, GameMapInfo, GameServerInfo}, indicator::{IndicatorConfig, IndicatorPosition}, object::{ObjectDamageMarker, ObjectDrawInfo, ObjectHealth, ObjectInvincibilityMarker, ObjectName, ObjectOpacity, ObjectScore, ObjectShape, ObjectZIndex}};

pub struct ProtocolPlugin;

impl Plugin for ProtocolPlugin {
    fn build(&self, app: &mut App) {

        // camera
        app.register_component::<Camera>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<PlayerStatus>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<PlayerStats>(ChannelDirection::ServerToClient);

        app.register_component::<AvailableClasses>(ChannelDirection::ServerToClient);

        app.register_component::<ConsoleCommands>(ChannelDirection::ServerToClient);

        app.register_component::<RenderToggles>(ChannelDirection::ServerToClient);

        app.register_component::<PlayerId>(ChannelDirection::ServerToClient);

        // game
        // add prediction and use full sync mode if you change map info often
        app.register_component::<GameMapInfo>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Simple);

        app.register_component::<GameServerInfo>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);
        
        app.register_component::<GameLobbyInfo>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Simple)
            .add_prediction(ComponentSyncMode::Simple);

        // indicator
        app.register_component::<IndicatorConfig>(ChannelDirection::ServerToClient);

        app.register_component::<IndicatorPosition>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);

        // object
        app.register_component::<ObjectName>(ChannelDirection::ServerToClient);

        app.register_component::<ObjectScore>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Simple)
            .add_prediction(ComponentSyncMode::Simple);  

        // use full sync mode if opacity is critical
        app.register_component::<ObjectOpacity>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Simple)
            .add_prediction(ComponentSyncMode::Simple);

        app.register_component::<ObjectShape>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<ObjectDrawInfo>(ChannelDirection::ServerToClient);

        app.register_component::<ObjectHealth>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<ObjectDamageMarker>(ChannelDirection::ServerToClient);

        app.register_component::<ObjectInvincibilityMarker>(ChannelDirection::ServerToClient);
        
        app.register_component::<ObjectZIndex>(ChannelDirection::ServerToClient);

        app.register_component::<RigidBody>(ChannelDirection::ServerToClient);

        app.register_component::<Rotation>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full)
            .add_interpolation_fn(rotation::lerp)
            .add_correction_fn(rotation::lerp);

        app.register_component::<Position>(ChannelDirection::ServerToClient)
            .add_interpolation(ComponentSyncMode::Full)
            .add_prediction(ComponentSyncMode::Full)
            .add_interpolation_fn(position::lerp)
            .add_correction_fn(position::lerp);

        app.register_component::<LinearVelocity>(ChannelDirection::ServerToClient)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<AngularVelocity>(ChannelDirection::ServerToClient)
            .add_prediction(ComponentSyncMode::Full);

        app.register_component::<LinearDamping>(ChannelDirection::ServerToClient);

        app.register_component::<AngularDamping>(ChannelDirection::ServerToClient);
    }
}