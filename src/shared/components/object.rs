use std::ops::{Deref, DerefMut};

use bevy::ecs::component::Component;
use serde::{Deserialize, Serialize};

use crate::shared::util::{drawinfo::DrawInfo, paint::Paint, shape::Shape};

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectName {
    pub name: String,
    pub draw_info: Option<DrawInfo>,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectScore {
    pub score: i32,
    pub draw_info: Option<DrawInfo>,
}



#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectOpacity(pub f32);

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectShape(pub Shape);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectDrawInfo(pub DrawInfo);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectHealth {
    pub health: f32,
    pub max_health: f32,
    pub custom_healthbar_color: Option<Paint>,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectDamageMarker;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectInvincibilityMarker;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct ObjectZIndex(pub i32);
