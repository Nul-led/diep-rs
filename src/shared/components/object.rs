use bevy::ecs::component::Component;
use serde::{Deserialize, Serialize};

use crate::shared::util::{drawinfo::DrawInfo, shape::Shape};

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Name {
    pub name: String,
    pub draw_info: Option<DrawInfo>,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Score {
    pub name: i64,
    pub draw_info: Option<DrawInfo>
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Opacity(f32);

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectShape(Shape);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectDrawInfo(DrawInfo);

// flash damage => change color
// flash invincibility => change color



