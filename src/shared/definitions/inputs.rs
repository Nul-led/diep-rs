use bevy::math::Vec2;

#[derive(Clone, Copy, Debug)]
pub enum Inputs {
    Shoot,
    Repel,
    Up,
    Down,
    Left,
    Right,

    Mouse(Vec2),
}