use bevy::{ecs::component::Component, math::Vec2};

#[derive(Clone, Copy, Debug, Default, Component)]
pub struct MapInfo {
    pub size: Vec2,
    pub padding: f32,
    pub grid_size: f32,
}

#[derive(Clone, Copy, Debug, Default, Component)]
pub struct ServerInfo {
    pub max_tps: f32,
    pub tps: f32,
}

#[derive(Clone, Copy, Debug, Default, Component)]
pub struct LobbyInfo {
    pub countdown: Option<u32>,
    pub waiting_for_players: Option<u16>,
}

