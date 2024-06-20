use bevy::prelude::Component;

#[derive(Component, Clone, Copy, PartialEq)]
pub enum KillReward {
    /// If the entity does not have a `Score` component, the reward will be 0
    Score,
    /// If the entity does not have a `Score` component, the reward will be 0
    ScoreCapped(i32),
    Exact(i32),
}