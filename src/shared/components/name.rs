use bevy::ecs::component::Component;

use crate::shared::util::drawinfo::DrawInfo;

#[derive(Clone, Debug, Default, Component)]
pub struct Name {
    pub name: String,
    pub draw_info: Option<DrawInfo>
}