use std::f32::consts::TAU;

use bevy::ecs::component::Component;
use bevy_xpbd_2d::math::Scalar;

use crate::shared::definitions::config::TICKS_PER_SECOND;

#[derive(Clone, Copy, PartialEq, Component)]
pub struct OrbitRoutine(pub Scalar, Scalar);

impl Default for OrbitRoutine {
    fn default() -> Self {
        Self(0.12 / TICKS_PER_SECOND as Scalar, 0.0)
    }
}

impl OrbitRoutine {
    pub fn step(&mut self) -> Scalar {
        self.1 += self.0;
        self.1 %= TAU as Scalar;
        self.1
    }
}