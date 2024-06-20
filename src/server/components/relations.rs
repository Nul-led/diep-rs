use bevy::prelude::{Component, Deref, DerefMut, Entity};

/// By default the owner of an entity is itself
#[derive(Component, Clone, Copy, PartialEq, Deref, DerefMut)]
pub struct Owner(pub Entity);

/// By default the team of an entity is itself
#[derive(Component, Clone, Copy, PartialEq, Deref, DerefMut)]
pub struct Team(pub Entity);