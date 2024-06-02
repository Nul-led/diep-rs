use bevy::{
    app::{App, FixedUpdate, Plugin},
    core::{FrameCountPlugin, TaskPoolPlugin, TypeRegistrationPlugin},
    diagnostic::{DiagnosticsPlugin, EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin},
    ecs::{
        change_detection::DetectChanges, entity::Entity, query::{Has, QueryData, Without}, schedule::{IntoSystemConfigs, IntoSystemSetConfigs, SystemSet}, system::{Commands, Query, Res, ResMut}
    },
    hierarchy::HierarchyPlugin,
    log::LogPlugin,
    math::Vec2,
    time::{Time, TimePlugin},
    transform::TransformPlugin,
};
use bevy_xpbd_2d::{
    components::{AngularVelocity, Friction, Restitution, RigidBodyQuery, Sleeping}, constraints::{PenetrationConstraint, XpbdConstraint}, math::Scalar, plugins::{
        collision::{Collider, ColliderParent, ColliderTransform, Collisions, ContactData, Sensor}, setup::Physics, solver::PenetrationConstraints, BroadPhasePlugin, ColliderBackendPlugin, ContactReportingPlugin, IntegratorPlugin, NarrowPhasePlugin, PhysicsPlugins, PhysicsSetupPlugin, PreparePlugin, SleepingPlugin, SolverPlugin, SpatialQueryPlugin, SyncPlugin
    }, resources::Gravity, PhysicsSet, SubstepSchedule, SubstepSet
};
use tracing::Level;

use crate::shared::{
    definitions::config::TICKS_PER_SECOND, systems::test::minimum_velocity_system,
};

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
            PhysicsPlugins::new(FixedUpdate),
        ));
        
        app.configure_sets(
            FixedUpdate,
            (
                // make sure that any physics simulation happens after the Main SystemSet
                // (where we apply user's actions)
                (
                    PhysicsSet::Prepare,
                    PhysicsSet::StepSimulation,
                    PhysicsSet::Sync,
                )
                    .in_set(FixedSet::Physics),
                (FixedSet::Main, FixedSet::Physics).chain(),
            ),
        );

        app.insert_resource(Time::new_with(Physics::fixed_once_hz(TICKS_PER_SECOND)));

        app.insert_resource(Gravity(Vec2::ZERO));

        app.add_systems(FixedUpdate, minimum_velocity_system);
    }
}