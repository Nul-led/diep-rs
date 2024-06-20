use std::ops::{Deref, DerefMut};

use bevy::{
    ecs::component::Component,
    math::Vec2,
    prelude::{Deref, DerefMut},
};
use parry2d::{bounding_volume::Aabb, math::Isometry, na::Vector2, shape::SharedShape};
use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Eq)]
pub enum RigidBody {
    None,
    #[default]
    Dynamic,
    Static,
    Kinematic,
}

impl RigidBody {
    /// Checks if the rigid body is none.
    pub fn is_none(&self) -> bool {
        *self == Self::None
    }

    /// Checks if the rigid body is dynamic.
    pub fn is_dynamic(&self) -> bool {
        *self == Self::Dynamic
    }

    /// Checks if the rigid body is static.
    pub fn is_static(&self) -> bool {
        *self == Self::Static
    }
}

/// The amount of resistance this object has to incoming impulses
/// Known values from diep:
/// Small Crasher: 0.5
/// Square, Triangle: 1
/// Pentagon: 2
/// Large Crasher: 10
/// Alpha Pentagon: 20
#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq, Deref, DerefMut)]
pub struct ImpactResistance(pub f32);

impl Default for ImpactResistance {
    fn default() -> Self {
        Self(1.0)
    }
}

/// The amount of force this object applies to outgoing impulses
/// Known values from diep:
/// Square & Triangle & Small Crasher: 8
/// Pentagon, Alpha Pentagon: 11
/// Large Crasher: 12
#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq, Deref, DerefMut)]
pub struct ImpactPotency(pub f32);

impl Default for ImpactPotency {
    fn default() -> Self {
        Self(8.0)
    }
}

/// Describes the factor by which a colliding object might be reflected at a different (randomized) angle
/// Default for any normal diep entity is 0
#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Deref, DerefMut)]
pub struct ImpactDeflection(pub f32);

// -- Position -- //

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Deref, DerefMut)]
pub struct LinearVelocity(pub Vec2);

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Deref, DerefMut)]
pub struct PreSolveLinearVelocity(pub Vec2);

#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq, Deref, DerefMut)]
pub struct LinearVelocityRetention(pub f32);

impl Default for LinearVelocityRetention {
    fn default() -> Self {
        Self(0.9)
    }
}

/// LinearVelocityConstraints.0 = min velocity; will be set to 0 if this is reached
/// LinearVelocityConstraints.1 = max velocity; will be clamped to this value if this is reached
#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq)]
pub struct LinearVelocityConstraints(pub f32, pub f32);

impl Default for LinearVelocityConstraints {
    fn default() -> Self {
        Self(0.01, 1000.0)
    }
}

// -- Rotation -- //

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Deref, DerefMut)]
pub struct AngularVelocity(pub f32);

#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq, Deref, DerefMut)]
pub struct AngularVelocityRetention(pub f32);

impl Default for AngularVelocityRetention {
    fn default() -> Self {
        Self(1.0)
    }
}

/// AngularVelocityConstraints.0 = min velocity; will be set to 0 if this is reached
/// AngularVelocityConstraints.1 = max velocity; will be clamped to this value if this is reached
#[derive(Clone, Copy, Component, Serialize, Deserialize, PartialEq)]
pub struct AngularVelocityConstraints(pub f32, pub f32);

impl Default for AngularVelocityConstraints {
    fn default() -> Self {
        Self(0.0, 1000.0)
    }
}

/// The amount of dominance an object has in relation to other objects
/// During impact, the object with the higher dominance will be unaffected   
#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq, Deref, DerefMut)]
pub struct Dominance(pub i8);

#[derive(Clone, Component)]
pub struct Collider(pub SharedShape);

impl Collider {
    pub fn aabb(&self, position: Vec2, rotation: f32) -> Aabb {
        self.0.compute_aabb(&Isometry::<f32>::new(
            Vector2::new(position.x, position.y),
            rotation,
        ))
    }
}

impl Default for Collider {
    fn default() -> Self {
        Self(SharedShape::ball(0.5))
    }
}

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq)]
pub struct IgnoreMapBorder;

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq)]
pub struct IgnoreStaticRigidBodies;

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq)]
pub struct IgnoreCollisions;

#[derive(Clone, Copy, Component, Serialize, Deserialize, Default, PartialEq)]
pub struct IgnoreRotationPropagation;
