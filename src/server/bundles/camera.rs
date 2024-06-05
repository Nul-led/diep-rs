use bevy::{ecs::bundle::Bundle, transform::TransformBundle};
use bevy_xpbd_2d::components::{LinearVelocity, Position};

use crate::shared::components::{camera::{AvailableClasses, ConsoleCommands, LevelbarProgress, PlayerClassName, PlayerId, PlayerLevel, PlayerName, PlayerScore, PlayerStats, RenderToggles, ScorebarProgress, ViewRange}, markers::CameraMarker};

#[derive(Clone, Bundle, Default)]
pub struct CameraBundle {
    pub marker: CameraMarker,
    pub position: Position,
    pub linear_vel: LinearVelocity,
    pub view: ViewRange,
    pub player_id: PlayerId,
    pub player_name: PlayerName,
    pub player_level: PlayerLevel,
    pub player_class_name: PlayerClassName,
    pub levelbar: LevelbarProgress,
    pub player_score: PlayerScore,
    pub scorebar: ScorebarProgress,
    pub player_stats: PlayerStats,
    pub available_classes: AvailableClasses,
    pub console_commands: ConsoleCommands,
    pub render_toggles: RenderToggles,
    pub transform: TransformBundle,
}