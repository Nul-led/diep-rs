use bevy::app::{App, Plugin};
use bevy_xpbd_2d::components::{AngularDamping, AngularVelocity, LinearDamping, LinearVelocity, Position, RigidBody, Rotation};
use lightyear::{channel::builder::ChannelDirection, prelude::AppComponentExt};

use crate::shared::components::{camera::{AvailableClasses, ConsoleCommands, LevelbarProgress, PlayerClassName, PlayerId, PlayerLevel, PlayerName, PlayerScore, PlayerStats, RenderToggles, ScorebarProgress, ViewRange}, game::{GameLobbyInfo, GameMapInfo, GameServerInfo}, indicator::IndicatorConfig, markers::CameraMarker, object::{ObjectDamageMarker, ObjectDrawInfo, ObjectHealth, ObjectInvincibilityMarker, ObjectName, ObjectOpacity, ObjectScore, ObjectShape, ObjectZIndex}};

pub struct ProtocolPlugin;

impl Plugin for ProtocolPlugin {
    fn build(&self, app: &mut App) {
        // camera
        app.register_component::<CameraMarker>(ChannelDirection::ServerToClient);
        app.register_component::<ViewRange>(ChannelDirection::ServerToClient);
        app.register_component::<PlayerName>(ChannelDirection::ServerToClient);
        app.register_component::<PlayerClassName>(ChannelDirection::ServerToClient);
        app.register_component::<PlayerLevel>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<LevelbarProgress>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<PlayerScore>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<ScorebarProgress>(ChannelDirection::ServerToClient);
        app.register_component::<PlayerStats>(ChannelDirection::ServerToClient);
        app.register_component::<AvailableClasses>(ChannelDirection::ServerToClient);
        app.register_component::<ConsoleCommands>(ChannelDirection::ServerToClient);
        app.register_component::<RenderToggles>(ChannelDirection::ServerToClient);
        app.register_component::<PlayerId>(ChannelDirection::ServerToClient);

        // game
        app.register_component::<GameMapInfo>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<GameServerInfo>(ChannelDirection::ServerToClient);
        app.register_component::<GameLobbyInfo>(ChannelDirection::ServerToClient);

        // indicator
        app.register_component::<IndicatorConfig>(ChannelDirection::ServerToClient);

        // object
        app.register_component::<ObjectName>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectScore>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectOpacity>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectShape>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectDrawInfo>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<ObjectHealth>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectDamageMarker>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectInvincibilityMarker>(ChannelDirection::ServerToClient);
        app.register_component::<ObjectZIndex>(ChannelDirection::ServerToClient);
        app.register_component::<RigidBody>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<Rotation>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<Position>(ChannelDirection::ServerToClient);
        app.register_component::<LinearVelocity>(ChannelDirection::ServerToClient);
        app.register_component::<AngularVelocity>(ChannelDirection::ServerToClient);
        app.register_component::<LinearDamping>(ChannelDirection::ServerToClient);
        app.register_component::<AngularDamping>(ChannelDirection::ServerToClient);
    }
}