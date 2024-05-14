use super::paint::Paint;

#[derive(Clone, Copy, Debug, Default)]
pub struct Stroke {
    pub width: f32,
    pub paint: Paint,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct DrawInfo {
    pub fill: Option<Paint>,
    pub stroke: Option<Stroke>,
}