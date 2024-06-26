use bevy::{prelude::{Component, Deref, DerefMut}, time::{Timer, TimerMode}};

use crate::shared::definitions::config::TICK_DURATION;

/// Expresses the ability of an object to negate incoming damage
#[derive(Component, Copy, Clone, PartialEq, Deref, DerefMut)]
pub struct DefensePower(pub f32);

impl Default for DefensePower {
    fn default() -> Self {
        Self(1.0)
    }
}

/// A utility component that allows implementation of random misses & random deflections (aka less severe hits) 
#[derive(Component, Copy, Clone, PartialEq, Default)]
pub struct AttackDeflection {
    /// Chance of a hit not inflicting damage
    /// (0.0 .. 1.0)
    pub miss_chance: f64,
    /// Chance of a hit inflicting less damage (determined by `deflection_factor`)
    /// (0.0 .. 1.0)
    pub deflection_chance: f64,
    /// Factor that determines how much damage may be deflected
    /// (0.0 .. 1.0)
    pub deflection_factor: f32,
}

/// Expresses the amount of damage an object can inflict on a target
#[derive(Component, Copy, Clone, PartialEq, Deref, DerefMut)]
pub struct AttackDamage(pub f32);

impl Default for AttackDamage {
    fn default() -> Self {
        Self(8.0)
    }
}

/// A utility component that allows implementation of critical hits
#[derive(Component, Copy, Clone, PartialEq, Default)]
pub struct CriticalAttacks {
    /// Critical hit chance
    /// (0.0 .. 1.0)
    pub chance: f64,
    /// Critical damage factor, multiplies outgoing damage if a critical hit occurs
    pub factor: f32,
}

/// Marks an object as having an attack cooldown, meaning it may not be damaged twice in a single tick
#[derive(Component, Copy, Clone, PartialEq, Default)]
pub struct AttackCooldownMarker;

/// Marks an object as being hit at a certain tick / frame (uses FrameCount, so it is wrapping)
#[derive(Component, Copy, Clone, PartialEq, Default, Deref, DerefMut)]
pub struct LastDamageTick(pub u32);

/// Configure normal and boosted regen
#[derive(Component, Clone, PartialEq)]
pub struct Regeneration {
    /// regeneration per second
    pub amount: f32,
    /// timer for regen boost
    pub boost_timer: Timer,
    /// boosted regeneration per second (percentage of max health)
    pub boost_factor: f32,
}

impl Default for Regeneration {
    fn default() -> Self {
        Self {
            amount: 0.0,
            boost_timer: Timer::from_seconds(30.0, TimerMode::Once),
            boost_factor: 0.1,
        }
    }
}

/// Marks an entity for despawn, may be used to run animations
#[derive(Component, Clone, PartialEq, Deref, DerefMut)]
pub struct DespawnMarker(pub Timer);

impl Default for DespawnMarker {
    fn default() -> Self {
        Self(Timer::from_seconds(5.0 * TICK_DURATION as f32, TimerMode::Once))
    }
}