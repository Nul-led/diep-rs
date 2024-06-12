use bevy::{ecs::bundle::Bundle, transform::TransformBundle};
use lightyear::connection::netcode::ClientId;

use crate::shared::components::{camera::{AvailableClasses, ConsoleCommands, LevelbarProgress, PlayerClassName, PlayerId, PlayerLevel, PlayerName, PlayerScore, PlayerStats, RenderToggles, ScorebarProgress, ViewRange}, markers::CameraMarker, physics::{AngularVelocity, AngularVelocityConstraints, AngularVelocityRetention, LinearVelocity, LinearVelocityConstraints, LinearVelocityRetention, PreSolveLinearVelocity, RigidBody}};

#[derive(Clone, Bundle, Default)]
pub struct CameraBundle {
    pub marker: CameraMarker,
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
    pub rigid_body: RigidBody,
    pub presolve_linear_velocity: PreSolveLinearVelocity,
    pub linear_velocity: LinearVelocity,
    pub linear_velocity_retention: LinearVelocityRetention,
    pub linear_velocity_constraints: LinearVelocityConstraints,
    pub angular_velocity: AngularVelocity,
    pub angular_velocity_retention: AngularVelocityRetention,
    pub angular_velocity_constraints: AngularVelocityConstraints,
}

impl CameraBundle {
    pub fn new(client: ClientId) -> Self {
        Self {
            player_id: PlayerId(client),
            rigid_body: RigidBody::None,
            linear_velocity_retention: LinearVelocityRetention(1.0),
            view: ViewRange(0.3),
            ..Default::default()
        }
    }
}