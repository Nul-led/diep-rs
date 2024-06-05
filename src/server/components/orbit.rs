use std::f32::consts::TAU;

use bevy::ecs::component::Component;
use bevy_xpbd_2d::math::Scalar;
use rand::random;

use crate::shared::definitions::config::TICKS_PER_SECOND;

#[derive(Clone, Copy, PartialEq, Component)]
pub struct OrbitRoutine {
    pub rate: Scalar,
    pub velocity: f32,
    current: Scalar,
}

impl Default for OrbitRoutine {
    fn default() -> Self {
        Self {
            rate: match random::<bool>() {
                true => 0.12,
                false => -0.12
            } / TICKS_PER_SECOND as Scalar,
            velocity: 5.0 / TICKS_PER_SECOND as Scalar,
            current: 0.0
        }
    }
}

impl OrbitRoutine {
    pub fn step(&mut self) -> Scalar {
        self.current += self.rate;
        self.current %= TAU as Scalar;
        self.current
    }
}