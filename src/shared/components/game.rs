use bevy::{ecs::component::Component, math::Vec2};
use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct MapInfo {
    pub size: Vec2,
    pub padding: f32,
    pub grid_size: f32,
}
#[derive(Clone, Copy, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ServerInfo {
    pub max_tps: f32,
    pub tps: f32,
    pub players: u32,
}

#[derive(Clone, Copy, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct LobbyInfo {
    pub countdown: Option<u32>,
    pub waiting_for_players: Option<u16>,
}

//#[derive(Clone, Debug, Default, Component)]
//pub struct Scoreboard(Vec<ScoreboardEntry>);