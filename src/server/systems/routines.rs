use bevy::{ecs::system::Query, math::Vec2};
use bevy_xpbd_2d::components::{AngularDamping, AngularVelocity, LinearDamping, LinearVelocity};

use crate::server::components::{orbit::OrbitRoutine, rotation::RotationRoutine};

pub fn system_orbit_routine(mut query: Query<(&mut LinearVelocity, &LinearDamping, &mut OrbitRoutine)>) {
    for (mut vel, damp, mut orbit) in query.iter_mut() {
        vel.0 += Vec2::from_angle(orbit.step()) * (damp.0 + 0.1);
    } 
}

pub fn system_rotation_routine(mut query: Query<(&mut AngularVelocity, &AngularDamping, &RotationRoutine)>) {
    for (mut vel, damp, rotation) in query.iter_mut() {
        vel.0 += rotation.0 * damp.0;
    }
}