use bevy::{ecs::component::Component, math::Vec2};

use crate::shared::util::paint::Paint;

#[derive(Clone, Debug, Default, Component)]
pub struct Indicator {
    pub position: Vec2,
    pub name: String,
    pub paint: Paint,
}
