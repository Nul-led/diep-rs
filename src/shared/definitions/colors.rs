use serde::{Deserialize, Serialize};

use crate::shared::util::paint::Paint;

#[derive(Clone, Copy, Serialize, Deserialize, Default, PartialEq)]
pub enum Colors {
    /// Borders #555555
    Gray1,
    /// Barrel #999999
    Gray2,
    /// Maze Wall #BBBBBB
    Gray3,
    /// Fallen #C0C0C0
    Gray4,
    /// Background #CCCCCC
    Gray5,
    /// Team Blue & Own Tank #00B2E1
    Blue1,
    /// Pentagon #768DFC
    Blue2,
    /// Team Red & Enemy Tank #F14E54
    Red1,
    /// Triangle #FC7677
    Red2,
    /// Team Green #00E16E
    Green1,
    /// Shiny #8AFF69
    Green2,
    /// Scoreboard & Scorebar #43FF91
    Green3,
    /// Square & Neutral #FFE69
    Yellow1,
    /// Necromancer Square #FCC376
    Yellow2,
    /// Team Purple #BF7FF5
    Purple,
    /// Crasher #F177DD
    Magenta,
    #[default]
    /// Text Stroke #000000
    Black,
    /// Text Fill #FFFFFF
    White,
}

impl From<Colors> for Paint {
    fn from(value: Colors) -> Paint {
        match value {
            Colors::Gray1 => Paint::RGB(85, 85, 85),
            Colors::Gray2 => Paint::RGB(153, 153, 153),
            Colors::Gray3 => Paint::RGB(187, 187, 187),
            Colors::Gray4 => Paint::RGB(192, 192, 192),
            Colors::Gray5 => Paint::RGB(204, 204, 204),
            Colors::Blue1 => Paint::RGB(0, 178, 225),
            Colors::Blue2 => Paint::RGB(118, 141, 252),
            Colors::Red1 => Paint::RGB(241, 78, 84),
            Colors::Red2 => Paint::RGB(252, 118, 119),
            Colors::Green1 => Paint::RGB(0, 225, 110),
            Colors::Green2 => Paint::RGB(138, 255, 105),
            Colors::Green3 => Paint::RGB(67, 255, 145),
            Colors::Yellow1 => Paint::RGB(255, 232, 105),
            Colors::Yellow2 => Paint::RGB(252, 195, 118),
            Colors::Purple => Paint::RGB(191, 127, 245),
            Colors::Magenta => Paint::RGB(241, 119, 221),
            Colors::Black => Paint::RGB(0, 0, 0),
            Colors::White => Paint::RGB(255, 255, 255),
        }
    }
}
