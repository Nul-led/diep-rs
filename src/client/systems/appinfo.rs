use bevy::{diagnostic::{DiagnosticsStore, EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin}, ecs::system::{Query, Res}};

use crate::{client::web::{set_app_info_body, set_app_info_header}, shared::components::game::{GameModeInfo, GameServerInfo}};

pub fn system_update_app_info(
    diagnostics: Res<DiagnosticsStore>,
    q_game: Query<(&GameServerInfo, &GameModeInfo)>,
) {
    let fps = diagnostics.get(&FrameTimeDiagnosticsPlugin::FPS).and_then(|fps| fps.smoothed()).unwrap_or_default();
    let entity_count = diagnostics.get(&EntityCountDiagnosticsPlugin::ENTITY_COUNT).and_then(|count| count.value()).unwrap_or_default();

    let mut lines = vec![format!("{:>4.0} fps", fps),];

    if let Ok((server_info, gamemode)) = q_game.get_single() {
        lines.push(format!("{} / {} tps", server_info.tps, server_info.max_tps));
        lines.push(format!("{} ent", entity_count));
        lines.push(gamemode.gamemode_name.clone());
        lines.push(format!("{} players", server_info.players));
        set_app_info_header(&gamemode.origin);
    }

    set_app_info_body(&lines.join("\n"));
}