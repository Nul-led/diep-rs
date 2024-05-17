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

#[derive(Copy, Clone, Serialize, Deserialize, Component, PartialEq)]
pub enum ObjectZIndex {
    /// Indicates the order in which this node should be rendered relative to its siblings.
    Local(i32),
    /// Indicates the order in which this node should be rendered relative to root nodes and
    /// all other nodes that have a global z-index.
    Global(i32),
}

impl Default for ObjectZIndex {
    fn default() -> Self {
        Self::Local(0)
    }
}