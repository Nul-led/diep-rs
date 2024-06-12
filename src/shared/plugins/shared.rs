use bevy::{
    app::{App, FixedUpdate, Plugin, Update},
    core::{FrameCountPlugin, TaskPoolPlugin, TypeRegistrationPlugin},
    diagnostic::{DiagnosticsPlugin, EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin},
    ecs::{
        change_detection::DetectChanges, entity::Entity, query::{Has, QueryData, Without}, schedule::{IntoSystemConfigs, IntoSystemSetConfigs, ScheduleLabel, SystemSet}, system::{Commands, Query, Res, ResMut}
    },
    hierarchy::HierarchyPlugin,
    log::LogPlugin,
    math::Vec2,
    time::{Fixed, Time, TimePlugin},
    transform::TransformPlugin,
};
use tracing::Level;

use crate::shared::{
    definitions::config::TICKS_PER_SECOND, systems::test::{minimum_velocity_system},
};

use super::physics::{PhysicsPlugin, PhysicsSet};

#[derive(SystemSet, Debug, Hash, PartialEq, Eq, Clone, Copy)]
pub enum FixedSet {
    // main fixed update systems (handle inputs)
    Main,
    // apply physics steps
    Physics,
}

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
            PhysicsPlugin(FixedUpdate.intern())
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

        //app.insert_resource(Time::new_with(Physics::fixed_once_hz(TICKS_PER_SECOND)));


        //app.add_systems(FixedUpdate, (minimum_velocity_system));
    }
}