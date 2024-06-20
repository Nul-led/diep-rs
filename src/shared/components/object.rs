use bevy::{ecs::component::Component, prelude::{Deref, DerefMut}};
use serde::{Deserialize, Serialize};

use crate::shared::util::{drawinfo::TextDrawConfig, paint::Paint};

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Name {
    pub name: String,
    pub draw_config: TextDrawConfig,
}

#[derive(Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Score {
    pub score: i32,
    pub draw_config: TextDrawConfig,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq, Deref, DerefMut)]
pub struct Opacity(pub f32);

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct Health {
    pub health: f32,
    pub max_health: f32,
    pub custom_healthbar_paint: Option<Paint>,
}

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct DamageMarker;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq)]
pub struct InvincibilityMarker;

#[derive(Copy, Clone, Serialize, Deserialize, Default, Component, PartialEq, Deref, DerefMut)]
pub struct ZIndex(pub i32);
