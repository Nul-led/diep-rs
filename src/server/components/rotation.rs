use bevy::ecs::component::Component;
use bevy_xpbd_2d::math::Scalar;
use rand::random;

use crate::shared::definitions::config::TICKS_PER_SECOND;

#[derive(Clone, Copy, PartialEq, Component)]
pub struct RotationRoutine(pub Scalar);

impl Default for RotationRoutine {
    fn default() -> Self {
        Self(match random::<bool>() {
            true => 0.25,
            false => -0.25
        } / TICKS_PER_SECOND as Scalar)
    }
}