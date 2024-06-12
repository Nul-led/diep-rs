use std::f32::consts::TAU;

use bevy::ecs::component::Component;
use rand::random;

#[derive(Clone, Copy, PartialEq, Component)]
pub struct OrbitRoutine {
    pub rate: f32,
    pub velocity: f32,
    current: f32,
}

impl Default for OrbitRoutine {
    fn default() -> Self {
        Self {
            rate: match random::<bool>() {
                true => 0.0048,
                false => -0.0048
            },
            velocity: 1.3, // TODO accuracy
            current: 0.0
        }
    }
}

impl OrbitRoutine {
    pub fn step(&mut self) -> f32 {
        self.current += self.rate;
        self.current %= TAU;
        self.current
    }
}