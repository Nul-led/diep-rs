use serde::{Deserialize, Serialize};

use super::paint::Paint;

#[derive(Clone, Copy, Serialize, Deserialize, Default, PartialEq)]
pub struct Stroke {
    pub width: f32,
    pub paint: Paint,
}

#[derive(Clone, Copy, Serialize, Deserialize, Default, PartialEq)]
pub struct DrawInfo {
    pub fill: Option<Paint>,
    pub stroke: Option<Stroke>,
}