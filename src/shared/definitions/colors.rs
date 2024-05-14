use crate::shared::util::paint::Paint;

#[derive(Clone, Copy, Debug, Default, Hash, PartialEq, Eq, PartialOrd, Ord)]
pub enum Colors {
    Matterhorn,     // Borders #555555
    Nobel,          // Barrel #999999
    IrisBlue,       // Team Blue & Own Tank #00B2E1
    RadicalRed,     // Team Red & Enemy Tank #F14E54
    Heliotrope,     // Team Purple #BF7FF5
    Malachite,      // Team Green #00E16E
    ScreamingGreen, // Shiny #8AFF69
    Corn,           // Square & Neutral #FFE69
    Froly,          // Triangle #FC7677
    CornflowerBlue, // Pentagon #768DFC
    PaleMagenta,    // Crasher #F177DD
    Shamrock,       // Scoreboard & Scorebar #43FF91
    Silver,         // Maze Wall #BBBBBB
    Chardonnay,     // Necromancer Square #FCC376
    Argent,         // Fallen #C0C0C0
    #[default]
    Black,          // Text Stroke #000000
    White,          // Text Fill #FFFFFF
}

impl From<Colors> for Paint {
    fn from(value: Colors) -> Paint {
        match value {
            Colors::Matterhorn => Paint::RGB(85, 85, 85),
            Colors::Nobel => Paint::RGB(153, 153, 153),
            Colors::IrisBlue => Paint::RGB(0, 178, 225),
            Colors::RadicalRed => Paint::RGB(241, 78, 84),
            Colors::Heliotrope => Paint::RGB(191, 127, 245),
            Colors::Malachite => Paint::RGB(0, 225, 110),
            Colors::ScreamingGreen => Paint::RGB(138, 255, 105),
            Colors::Corn => Paint::RGB(255, 232, 105),
            Colors::Froly => Paint::RGB(252, 118, 119),
            Colors::CornflowerBlue => Paint::RGB(118, 141, 252),
            Colors::PaleMagenta => Paint::RGB(241, 119, 221),
            Colors::Shamrock => Paint::RGB(67, 255, 145),
            Colors::Silver => Paint::RGB(187, 187, 187),
            Colors::Chardonnay => Paint::RGB(252, 195, 118),
            Colors::Argent => Paint::RGB(192, 192, 192),
            Colors::Black => Paint::RGB(0, 0, 0),
            Colors::White => Paint::RGB(255, 255, 255),
        }
    }
}
