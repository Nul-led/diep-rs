use bevy::ecs::component::Component;
use rand::random;

#[derive(Clone, Copy, PartialEq, Component)]
pub struct RotationRoutine(pub f32);

impl Default for RotationRoutine {
    fn default() -> Self {
        Self(match random::<bool>() {
            true => 0.01,
            false => -0.01
        })
    }
}