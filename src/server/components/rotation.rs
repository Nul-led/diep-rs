use bevy::{ecs::component::Component, prelude::{Deref, DerefMut}};
use rand::random;

#[derive(Component, Clone, Copy, PartialEq, Deref, DerefMut)]
pub struct RotationRoutine(pub f32);

impl Default for RotationRoutine {
    fn default() -> Self {
        Self(match random::<bool>() {
            true => 0.01,
            false => -0.01
        })
    }
}