use std::f32::consts::TAU;

use bevy::ecs::component::Component;
use bevy_xpbd_2d::math::Scalar;
use rand::random;

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
                true => 0.0048,
                false => -0.0048
            } as Scalar,
            velocity: 1.3 as Scalar, // TODO accuracy
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