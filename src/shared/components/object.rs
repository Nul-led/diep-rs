use bevy::ecs::component::Component;
use serde::{Deserialize, Serialize};

use crate::shared::util::{drawinfo::DrawInfo, shape::Shape};

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectName {
    pub name: String,
    pub draw_info: Option<DrawInfo>,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectScore {
    pub name: i64,
    pub draw_info: Option<DrawInfo>
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectOpacity(f32);

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectShape(Shape);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectDrawInfo(DrawInfo);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectDamageMarker;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectInvincibilityMarker;