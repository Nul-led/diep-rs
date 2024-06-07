use bevy::{ecs::system::Query, math::Vec2};
use bevy_xpbd_2d::components::{AngularDamping, AngularVelocity, LinearDamping, LinearVelocity, Rotation};

use crate::server::components::{orbit::OrbitRoutine, rotation::RotationRoutine};

pub fn system_orbit_routine(mut query: Query<(&mut LinearVelocity, &mut OrbitRoutine)>) {
    for (mut vel, mut orbit) in query.iter_mut() {
        vel.0 += Vec2::from_angle(orbit.step()) * orbit.velocity;
    } 
}

pub fn system_rotation_routine(mut query: Query<(&mut AngularVelocity, &RotationRoutine)>) {
    for (mut vel, routine) in query.iter_mut() {
        vel.0 = routine.0;
    }
}