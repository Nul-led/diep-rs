use bevy::math::Vec2;

#[cfg(feature = "server")]
use crate::server::util::class::{CannonConfig, ClassStatsConfig};

use super::{drawinfo::DrawInfo, shape::Shape};

#[derive(Clone, Debug, Default)]
pub struct ChildObjectConfig {
    // Determines if the object should be rendered before or after the parent object
    pub is_visible: bool,
    pub is_behind_parent: bool,
    pub is_rotation_relative: bool,
    /// Either relative rotation around the parent or absolute rotation
    pub rotation: f32,
    /// The rotation of the object around its own center
    pub rotational_offset: Option<f32>,
    /// Relative to the parent
    pub position: Vec2,
    pub shape: Shape,
    pub draw_info: DrawInfo,
    pub children: Vec<ChildObjectConfig>,

    #[cfg(feature = "server")]
    pub cannon: Option<CannonConfig>,
}

#[derive(Clone, Debug, Default)]
pub struct ClassConfig {
    pub name: &'static str,

    // Object properties
    pub is_visible: bool,
    pub rotation: f32,
    pub shape: Shape,
    pub draw_info: DrawInfo,

    #[cfg(feature = "server")]
    pub stats: ClassStatsConfig,
}