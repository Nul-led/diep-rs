use bevy::ecs::component::Component;
use serde::{Deserialize, Serialize};

use crate::shared::util::paint::Paint;

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct IndicatorConfig {
    pub name: String,
    pub paint: Paint,
}
