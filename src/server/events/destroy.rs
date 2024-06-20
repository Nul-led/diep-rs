use bevy::prelude::{Deref, DerefMut, Entity, Event};

#[derive(Clone, Copy, PartialEq, Deref, DerefMut, Event)]
pub struct DestroyEvent(pub Entity);