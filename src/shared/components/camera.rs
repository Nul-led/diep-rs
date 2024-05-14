
use bevy::{ecs::{component::Component, entity::Entity}, math::Vec2};

#[derive(Clone, Debug)]
pub enum CameraMode {
    Absolute {
        target: Vec2
    },
    Relative {
        target: Entity, // Requires: Transform
        movement_speed: f32,
    }
}

impl Default for CameraMode {
    fn default() -> Self {
        Self::Absolute { target: Vec2::ZERO }
    }
}

#[derive(Clone, Debug, Default, Component)]
pub struct Camera {
    pub mode: CameraMode,
    pub fov: f32,
}