use bevy::{
    ecs::{component::Component, entity::Entity},
    math::Vec2,
};
use lightyear::connection::netcode::ClientId;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub enum CameraMode {
    Absolute {
        target: Vec2,
    },
    Relative {
        target: Entity, // Requires: Transform
        movement_speed: f32,
    },
}

impl Default for CameraMode {
    fn default() -> Self {
        Self::Absolute { target: Vec2::ZERO }
    }
}

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct Camera {
    pub mode: CameraMode,
    pub fov: f32,
}

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct PlayerStatus {
    pub level: u32,
    pub levelbar: f32,
    pub score: u32,
    pub scorebar: f32,
    pub classname: String,
}

#[derive(Clone, Serialize, Deserialize, PartialEq)]
struct Stat {
    pub name: String,
    pub value: String,
}

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct PlayerStats(Vec<Stat>); // Death Stats

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct AvailableClasses(Vec<u16>); // TODO Available Tank Upgrades

#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub struct ConsoleCommand {
    //pub id: Commands, TODO
    pub name: String,
    pub description: String,
    pub usage: String,
}

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct ConsoleCommands(Vec<ConsoleCommand>);

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct RenderToggles {
    pub enable_app_info: bool,
    pub enable_attributes: bool,
    pub enable_classes: bool,
    pub enable_class_tree: bool,
    pub enable_invite: bool,
    pub enable_minimap: bool,
    pub enable_notifications: bool,
    pub enable_player_stats: bool,
    pub enable_player_status: bool,
    pub enable_scoreboard: bool,
    pub enable_scores: bool,
    pub enable_indicators: bool,
    pub enable_names: bool,
}

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct PlayerId(ClientId);