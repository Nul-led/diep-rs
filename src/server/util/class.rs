
#[derive(Clone, Debug, Default)]
pub struct ClassStatsConfig {
    pub abilities: ClassAbilities,
    pub fov: f32,
    pub movement_speed: f32,
    pub physics: ObjectPhysicsConfig,
    pub max_health: f32,
    pub attributes: Vec<AttributeConfig>,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct ClassAbilities {
    /**
     * Manager / Landmine / Stalker class ability
     * Uses "globalAlpha" so don't worry about this interfering with RGBA paint
     */
    pub invisiblity_ability: Option<InvisibilityAbilityConfig>,
    /// Predator class ability
    pub adjust_camera_ability: Option<AdjustCameraAbilityConfig>,
    /// Necromancer class ability
    pub necromancer_ability: Option<NecromancerAbilityConfig>,
}

/// Each field affects the opacity on every tick / event
#[derive(Clone, Copy, Debug, Default)]
pub struct InvisibilityAbilityConfig {
    pub opacity_loss: f32,
    pub opacity_gain_shooting: f32,
    pub opacity_gain_moving: f32,
    pub opacity_gain_damage: f32,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct AdjustCameraAbilityConfig {
    pub offset: f32,
    // TODO maybe provide other options like an constant position or an fov change?
}

#[derive(Clone, Copy, Debug, Default)]
pub struct NecromancerAbilityConfig {
    // TODO
}

#[derive(Clone, Copy, Debug, Default)]
pub struct ObjectPhysicsConfig {
    pub restitution: f32,
    pub friction: f32,
    pub density: f32,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct AttributeConfig {
    pub name: &'static str,
    pub limit: usize,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct CannonConfig {
    pub fire_cycle: CannonFireCycleConfig,
    pub projectile: ProjectileConfig,
    /// Enables attracting and repelling projectiles via inputs
    pub are_projectiles_controllable: bool,
    pub max_concurrent_projectile_count: Option<usize>,
    /// The rate at which bullets might deviate from the exact shooting angle
    pub scatter_rate: f32,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct CannonFireCycleConfig {
    pub delay: f32,
    pub recoil: f32,
    pub force_fire: bool,
}

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord)]
pub enum ProjectileType {
    #[default]
    Bullet,
    Drone,
    Trap,
    NecromancerDrone,
    Minion,
    Skimmer,
    Rocket,
    Swarm,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct ProjectileConfig {
    pub projectile_type: ProjectileType,
    pub size_ratio: f32,
    pub max_health: f32,
    pub movement_speed: f32,
    /// Some(factor) or None for no timer
    pub life_length: Option<f32>,
    pub physics: ObjectPhysicsConfig,
}
