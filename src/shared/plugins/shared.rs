use bevy::{
    app::{App, FixedUpdate, Plugin},
    core::{FrameCountPlugin, TaskPoolPlugin, TypeRegistrationPlugin},
    diagnostic::{DiagnosticsPlugin, EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin},
    ecs::schedule::{IntoSystemSetConfigs, ScheduleLabel, SystemSet},
    hierarchy::HierarchyPlugin,
    log::LogPlugin,
    time::{Fixed, Time, TimePlugin},
};
use tracing::Level;

use crate::shared::definitions::config::TICKS_PER_SECOND;

use super::{physics::{PhysicsPlugin, PhysicsSet}, transform::TransformPlugin};

#[derive(SystemSet, Debug, Hash, PartialEq, Eq, Clone, Copy)]
pub enum FixedSet {
    // main fixed update systems (handle inputs)
    Main,
    // apply physics steps
    Physics,
}

#[derive(Default)]
pub struct SharedInitPlugin;

impl Plugin for SharedInitPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            TaskPoolPlugin::default(),
            TypeRegistrationPlugin,
            FrameCountPlugin,
            TimePlugin,
            LogPlugin {
                level: Level::INFO,
                ..Default::default()
            },
            TransformPlugin,
            HierarchyPlugin,
            DiagnosticsPlugin,
            FrameTimeDiagnosticsPlugin,
            EntityCountDiagnosticsPlugin,
            PhysicsPlugin(FixedUpdate.intern()),
        ));

        app.configure_sets(
            FixedUpdate,
            (
                // make sure that any physics simulation happens after the Main SystemSet
                // (where we apply user's actions)
                (
                    PhysicsSet::ApplyVelocity,
                    PhysicsSet::BroadPhase,
                    PhysicsSet::NarrowPhase,
                    PhysicsSet::SolvingPhase,
                )
                    .in_set(FixedSet::Physics),
                (FixedSet::Main, FixedSet::Physics).chain(),
            ),
        );

        app.insert_resource(Time::<Fixed>::from_hz(TICKS_PER_SECOND));
    }
}
