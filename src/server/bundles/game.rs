use bevy::ecs::bundle::Bundle;

use crate::shared::components::game::{GameLobbyInfo, GameMapInfo, GameModeInfo, GameScoreboard, GameServerInfo};

#[derive(Clone, Bundle, Default)]
pub struct GameBundle {
    pub lobby: GameLobbyInfo,
    pub map: GameMapInfo,
    pub server: GameServerInfo,
    pub gamemode: GameModeInfo,
    pub scoreboard: GameScoreboard,
}