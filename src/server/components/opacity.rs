use bevy::prelude::Component;

#[derive(Component, Copy, Clone, PartialEq, Default)]
pub struct OpacityModificationConfig {
    pub on_movement: f32,
    pub on_attacked: f32,
    pub on_attack: f32,
    pub passive_opacity_gain: f32,
}