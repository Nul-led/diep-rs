use bevy::{app::{App, Plugin}, transform::components::{GlobalTransform, Transform}};
use lightyear::{channel::builder::ChannelDirection, prelude::AppComponentExt};

use crate::shared::{components::{camera::{AvailableClasses, ConsoleCommands, LevelbarProgress, PlayerClassName, PlayerId, PlayerLevel, PlayerName, PlayerScore, PlayerStats, RenderToggles, ScorebarProgress, ViewRange}, game::{GameLobbyInfo, GameMapInfo, GameServerInfo}, indicator::IndicatorConfig, markers::CameraMarker, object::{DamageMarker, Health, InvincibilityMarker, Name, Opacity, Score, ZIndex}, physics::{AngularVelocity, AngularVelocityRetention, Dominance, IgnoreCollisions, IgnoreMapBorder, IgnoreStaticRigidBodies, ImpactDeflection, ImpactPotency, ImpactResistance, LinearVelocity, LinearVelocityRetention, RigidBody}}, util::shape::ColliderTrace};

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
        app.register_component::<Name>(ChannelDirection::ServerToClient);
        app.register_component::<Score>(ChannelDirection::ServerToClient);
        app.register_component::<Opacity>(ChannelDirection::ServerToClient);
        app.register_component::<ColliderTrace>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<Health>(ChannelDirection::ServerToClient);
        app.register_component::<DamageMarker>(ChannelDirection::ServerToClient);
        app.register_component::<InvincibilityMarker>(ChannelDirection::ServerToClient);
        app.register_component::<ZIndex>(ChannelDirection::ServerToClient);
        app.register_component::<RigidBody>(ChannelDirection::ServerToClient);
        app.register_component::<GlobalTransform>(ChannelDirection::ServerToClient);
        app.register_component::<Transform>(ChannelDirection::ServerToClient);
        //TODO add interpolation
        app.register_component::<LinearVelocity>(ChannelDirection::ServerToClient);
        app.register_component::<AngularVelocity>(ChannelDirection::ServerToClient);
        app.register_component::<LinearVelocityRetention>(ChannelDirection::ServerToClient);
        app.register_component::<AngularVelocityRetention>(ChannelDirection::ServerToClient);
        app.register_component::<IgnoreMapBorder>(ChannelDirection::ServerToClient);
        app.register_component::<IgnoreStaticRigidBodies>(ChannelDirection::ServerToClient);
        app.register_component::<IgnoreCollisions>(ChannelDirection::ServerToClient);
        app.register_component::<Dominance>(ChannelDirection::ServerToClient);
        app.register_component::<ImpactDeflection>(ChannelDirection::ServerToClient);
        app.register_component::<ImpactPotency>(ChannelDirection::ServerToClient);
        app.register_component::<ImpactResistance>(ChannelDirection::ServerToClient);
    }
}