use bevy::{ecs::bundle::Bundle, transform::TransformBundle};

use crate::shared::components::physics::{AngularVelocity, AngularVelocityConstraints, AngularVelocityRetention, Collider, Dominance, ImpactDeflection, ImpactPotency, ImpactResistance, LinearVelocity, LinearVelocityConstraints, LinearVelocityRetention, PreSolveLinearVelocity, RigidBody};

#[derive(Clone, Bundle, Default)]
pub struct PhysicsBundle {
    pub rigid_body: RigidBody,
    pub collider: Collider,
    pub impact_resistance: ImpactResistance,
    pub impact_potency: ImpactPotency,
    pub impact_deflection: ImpactDeflection,
    pub dominance: Dominance,
}

#[derive(Clone, Bundle, Default)]
pub struct MovementBundle {
    pub transform: TransformBundle,
    pub presolve_linear_velocity: PreSolveLinearVelocity,
    pub linear_velocity: LinearVelocity,
    pub linear_velocity_retention: LinearVelocityRetention,
    pub linear_velocity_constraints: LinearVelocityConstraints,
    pub angular_velocity: AngularVelocity,
    pub angular_velocity_retention: AngularVelocityRetention,
    pub angular_velocity_constraints: AngularVelocityConstraints,
}