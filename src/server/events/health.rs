use bevy::prelude::{Deref, DerefMut, Entity, Event};

#[derive(Clone, Copy, PartialEq, Deref, DerefMut, Event)]
pub struct DeathEvent(pub Entity);

#[derive(Clone, Copy, PartialEq, Event)]
pub struct KillEvent {
    pub killer: Entity,
    pub target: Entity,
    pub reward: i32,
}