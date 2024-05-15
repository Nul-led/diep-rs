use bevy::ecs::component::Component;

use crate::shared::util::{drawinfo::DrawInfo, shape::Shape};

#[derive(Clone, Debug, Default, Component)]
pub struct Name {
    pub name: String,
    pub draw_info: Option<DrawInfo>,
}

#[derive(Clone, Debug, Default, Component)]
pub struct Score {
    pub name: i64,
    pub draw_info: Option<DrawInfo>
}

#[derive(Clone, Debug, Default, Component)]
pub struct Opacity(f32);

#[derive(Clone, Debug, Default, Component)]
pub struct ObjectShape(Shape);

#[derive(Clone, Debug, Default, Component)]
pub struct ObjectDrawInfo(DrawInfo);

// flash damage => change color
// flash invincibility => change color



