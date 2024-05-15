use bevy::{ecs::component::Component, math::Vec2};

use crate::shared::util::paint::Paint;

#[derive(Copy, Clone, Debug, Default, Component)]
pub struct IndicatorPosition(Vec2);

#[derive(Clone, Debug, Default, Component)]
pub struct IndicatorConfig {
    pub name: String,
    pub paint: Paint,
}