use bevy::{app::{App, FixedUpdate, Plugin}, math::Vec2, prelude::Query};

use crate::{server::components::{orbit::OrbitRoutine, rotation::RotationRoutine}, shared::components::physics::{AngularVelocity, LinearVelocity}};

#[derive(Clone, Copy, Default)]
pub struct RoutinePlugin;

impl Plugin for RoutinePlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(FixedUpdate, (system_orbit_routine, system_rotation_routine));
    }
}

fn system_orbit_routine(mut query: Query<(&mut LinearVelocity, &mut OrbitRoutine)>) {
    for (mut vel, mut orbit) in query.iter_mut() {
        vel.0 += Vec2::from_angle(orbit.step()) * orbit.velocity;
    } 
}

fn system_rotation_routine(mut query: Query<(&mut AngularVelocity, &RotationRoutine)>) {
    for (mut vel, routine) in query.iter_mut() {
        vel.0 = routine.0;
    }
}