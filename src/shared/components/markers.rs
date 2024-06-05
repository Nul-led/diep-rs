use bevy::ecs::component::Component;
use serde::{Deserialize, Serialize};

#[derive(Clone, Component, Default, Serialize, Deserialize, PartialEq)]
pub struct CameraMarker;
