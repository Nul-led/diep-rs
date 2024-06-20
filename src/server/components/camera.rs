use bevy::{ecs::entity::Entity, prelude::{Component, Deref, DerefMut}};

#[derive(Component, Clone, Copy, PartialEq, Deref, DerefMut)]
pub struct ObservationAnchor(pub Entity);