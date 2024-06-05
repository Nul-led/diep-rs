use bevy::{ecs::component::Component, math::Vec2};
use serde::{Deserialize, Serialize};

use crate::shared::definitions::{classes::ClassId, config::TICKS_PER_SECOND};

#[derive(Clone, Copy, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct GameMapInfo {
    pub size: Vec2,
    pub padding: f32,
    pub grid_size: u32,
}
#[derive(Clone, Copy, Serialize, Deserialize, Component, PartialEq)]
pub struct GameServerInfo {
    pub max_tps: f32,
    pub tps: f32,
    pub players: u32,
}

impl Default for GameServerInfo {
    fn default() -> Self {
        Self {
            max_tps: TICKS_PER_SECOND as f32,
            tps: 0.0,
            players: 0
        }
    }
}

#[derive(Clone, Copy, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct GameLobbyInfo {
    pub countdown: Option<u32>,
    pub waiting_for_players: Option<u16>,
}

#[derive(Clone, Serialize, Deserialize, Component, PartialEq)]
pub struct GameModeInfo {
    pub gamemode_name: String,
    pub origin: String,
}

impl Default for GameModeInfo {
    fn default() -> Self {
        Self {
            gamemode_name: "FFA".to_string(),
            origin: "diep.rs".to_string()
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct ScoreboardEntry {
    pub name: String,
    pub score: i32,
    pub suffix: String,
    pub class: Option<ClassId>,
}

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct GameScoreboard(pub Vec<ScoreboardEntry>);