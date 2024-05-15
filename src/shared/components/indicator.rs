use bevy::{ecs::component::Component, math::Vec2};
use serde::{Deserialize, Serialize};

use crate::shared::util::paint::Paint;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct IndicatorPosition(Vec2);

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct IndicatorConfig {
    pub name: String,
    pub paint: Paint,
}