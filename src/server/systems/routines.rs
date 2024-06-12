use bevy::{ecs::system::Query, math::Vec2, transform::components::Transform};

use crate::{server::components::{orbit::OrbitRoutine, rotation::RotationRoutine}, shared::components::physics::{AngularVelocity, LinearVelocity}};

pub fn system_orbit_routine(mut query: Query<(&mut LinearVelocity, &mut OrbitRoutine)>) {
    for (mut vel, mut orbit) in query.iter_mut() {
        vel.0 += Vec2::from_angle(orbit.step()) * 0.2;
    } 
}

pub fn system_rotation_routine(mut query: Query<(&mut AngularVelocity, &RotationRoutine)>) {
    for (mut vel, routine) in query.iter_mut() {
        vel.0 = routine.0;
    }
}