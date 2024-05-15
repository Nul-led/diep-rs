use bevy::math::Vec2;

#[cfg(feature = "server")]
use crate::server::util::class::{CannonConfig, ClassStatsConfig};

use super::{drawinfo::DrawInfo, shape::Shape};

#[derive(Clone, Debug, Default)]
pub struct ChildObjectConfig {
    /// Visibility of the object
    pub is_visible: bool,

    /// Determines if the object should be rendered before or after the parent object
    pub is_behind_parent: bool,

    /// Indicates whether or not the rotation is relative to the parents rotation
    pub is_rotation_relative: bool,
    
    /// Either relative rotation around the parent or absolute rotation
    pub rotation: f32,
    
    /// The rotation of the object around its own center
    pub rotational_offset: Option<f32>,

    /// Relative position offset from the parent's center
    pub position: Vec2,

    /// Shape of the object
    pub shape: Option<Shape>,

    /// Fill and stroke of the object
    pub draw_info: Option<DrawInfo>,

    /// Contains the next layer of cannons and addons in render order from lowest z to highest
    pub children: Vec<ChildObjectConfig>,

    /// Stats of the object (none => will behave as addon, some => will behave as cannon)
    #[cfg(feature = "server")]
    pub cannon: Option<CannonConfig>,

    /// Passive rotation of the object (eg. smasher addons)
    #[cfg(feature = "server")]
    pub passive_rotation: f32,

    // TODO routine cfg
}

#[derive(Clone, Debug, Default)]
pub struct ClassConfig {
    /// The classes name
    pub name: &'static str,

    /// Visibility of the class body
    pub is_visible: bool,

    /// Shape of the class body
    pub shape: Option<Shape>,

    /// Fill and stroke of the class body
    pub draw_info: Option<DrawInfo>,

    /// Contains the first layer of cannons and addons in render order from lowest z to highest
    pub children: Vec<ChildObjectConfig>,

    /// Stats of the class
    #[cfg(feature = "server")]
    pub stats: ClassStatsConfig,
}