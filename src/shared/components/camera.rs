use bevy::ecs::component::Component;
use lightyear::connection::netcode::ClientId;
use serde::{Deserialize, Serialize};

use crate::shared::definitions::{classes::ClassId, commands::ConsoleCommand};

#[derive(Clone, Component, Serialize, Deserialize, PartialEq)]
pub struct ViewRange(pub f32);

impl Default for ViewRange {
    fn default() -> Self {
        Self(0.55)
    }
}

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct PlayerName(pub String);

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct PlayerClassName(pub String);

#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq)]
pub struct PlayerLevel(pub u32);

impl Default for PlayerLevel {
    fn default() -> Self {
        Self(1)
    }
}

#[derive(Clone, Copy, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct LevelbarProgress(pub f32);

#[derive(Clone, Copy, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct PlayerScore(pub i32);

#[derive(Clone, Copy, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct ScorebarProgress(pub f32);

#[derive(Clone, Component, Serialize, Default, Deserialize, PartialEq)]
pub struct PlayerStats(pub Vec<(String, String)>);

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct AvailableClasses(pub Vec<ClassId>);

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct ConsoleCommands(pub Vec<ConsoleCommand>);

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
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

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct PlayerId(pub ClientId);