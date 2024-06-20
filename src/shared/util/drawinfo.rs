use bevy::math::Vec2;
use serde::{Deserialize, Serialize};

use super::paint::Paint;

#[derive(Clone, Default)]
pub struct DrawConfig {
    pub fill_style: Option<Paint>,
    pub stroke_style: Option<Paint>,
    pub line_width: Option<f32>,
    pub line_cap: Option<&'static str>,
    pub line_join: Option<&'static str>,
    pub line_dash: Option<LineDash>,
    pub shadow: Option<Shadow>,
    pub miter_limit: Option<f32>,
    pub text_align: Option<&'static str>,
    pub composite_operation: Option<&'static str>,
    pub font: Option<String>,
}

impl DrawConfig {
    pub fn from_object_draw_config(value: &ObjectDrawConfig) -> Self {
        match value {
            ObjectDrawConfig::None => Self::default(),
            ObjectDrawConfig::Simple { fill } => Self {
                fill_style: Some(*fill),
                stroke_style: Some(ObjectStrokeConfig::default().into_paint(fill)),
                line_width: Some(7.5),
                line_join: Some(LineJoin::Round.into()),
                ..Default::default()
            },
            ObjectDrawConfig::Style {
                fill,
                stroke,
                line_width,
            } => Self {
                fill_style: Some(*fill),
                stroke_style: Some(stroke.into_paint(fill)),
                line_width: Some(*line_width),
                line_join: Some(LineJoin::Round.into()),
                ..Default::default()
            },
            ObjectDrawConfig::Full {
                fill,
                stroke,
                line_width,
                line_cap,
                line_join,
                line_dash,
                shadow,
                miter_limit,
                composite_operation,
            } => Self {
                fill_style: Some(fill.unwrap_or_default()),
                stroke_style: Some(
                    stroke
                        .unwrap_or_default()
                        .into_paint(&fill.unwrap_or_default()),
                ),
                line_width: Some(line_width.unwrap_or(7.5)),
                line_cap: line_cap.and_then(|v| Some(Into::<&str>::into(v))),
                line_join: Some(line_join.unwrap_or(LineJoin::Round).into()),
                line_dash: line_dash.clone(), // Performance: A bit inefficient, but we gotta clone the sequence vec :/
                shadow: *shadow,
                miter_limit: *miter_limit,
                composite_operation: composite_operation.and_then(|v| Some(Into::<&str>::into(v))),
                ..Default::default()
            },
        }
    }

    pub fn from_text_draw_config(value: &TextDrawConfig, font_size: f32) -> Self {
        match value {
            TextDrawConfig::None => Self::default(),
            TextDrawConfig::Simple => {
                Self {
                    fill_style: Some(Paint::RGB(255, 255, 255)),
                    stroke_style: Some(Paint::RGB(0, 0, 0)),
                    line_width: Some(0.2 * font_size),
                    font: Some(format!("{}px Ubuntu", font_size)),
                    text_align: Some(TextAlign::Center.into()),
                    ..Default::default()
                }
            },
            TextDrawConfig::Style { line_width_factor, fill, stroke } => {
                Self {
                    fill_style: Some(*fill),
                    stroke_style: Some(*stroke),
                    line_width: Some(line_width_factor * font_size),
                    font: Some(format!("{}px Ubuntu", font_size)),
                    text_align: Some(TextAlign::Center.into()),
                    ..Default::default()
                }
            },
            TextDrawConfig::Full { line_width_factor, fill, stroke, line_cap, line_join, line_dash, shadow, miter_limit, align, composite_operation } => {
                Self {
                    fill_style: Some(fill.unwrap_or(Paint::RGB(255, 255, 255))),
                    stroke_style: Some(stroke.unwrap_or(Paint::RGB(0, 0, 0))),
                    line_width: Some(line_width_factor.unwrap_or(0.2) * font_size),
                    line_cap: line_cap.and_then(|v| Some(Into::<&str>::into(v))),
                    line_join: line_join.and_then(|v| Some(Into::<&str>::into(v))),
                    line_dash: line_dash.clone(),
                    shadow: *shadow,
                    miter_limit: *miter_limit,
                    text_align: Some(align.unwrap_or(TextAlign::Center).into()),
                    font: Some(format!("{}px Ubuntu", font_size)),
                    composite_operation: composite_operation.and_then(|v| Some(Into::<&str>::into(v))),
                }
            }
        }
    }
}

#[derive(Clone, Copy, Serialize, Deserialize, Default, PartialEq)]
pub enum ObjectStrokeConfig {
    #[default]
    BlendSimple,
    BlendFull {
        /// Defaults to 0.4
        factor: Option<f32>,
        /// Defaults to black
        paint: Option<Paint>,
    },
    Paint {
        paint: Paint,
    },
}

impl ObjectStrokeConfig {
    pub fn into_paint(&self, fill: &Paint) -> Paint {
        match self {
            ObjectStrokeConfig::BlendSimple => fill.blend_with(Paint::RGB(0, 0, 0), 0.4),
            ObjectStrokeConfig::BlendFull { factor, paint } => {
                fill.blend_with(paint.unwrap_or(Paint::RGB(0, 0, 0)), factor.unwrap_or(0.4))
            }
            ObjectStrokeConfig::Paint { paint } => *paint,
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Default, PartialEq)]
pub enum ObjectDrawConfig {
    /// None configuration; don't draw this object
    #[default]
    None,
    /// Simple configuration; stroke defaults to blend simple
    Simple { fill: Paint },
    Style {
        fill: Paint,
        stroke: ObjectStrokeConfig,
        line_width: f32,
    },
    Full {
        /// Defaults to transparent (no fill)
        fill: Option<Paint>,
        /// Defaults to blend simple
        stroke: Option<ObjectStrokeConfig>,
        /// Defaults to 7.5
        line_width: Option<f32>,
        /// Defaults to butt
        line_cap: Option<LineCap>,
        /// Defaults to round
        line_join: Option<LineJoin>,
        /// Defaults to no dashing
        line_dash: Option<LineDash>,
        /// Defaults to no shadow
        shadow: Option<Shadow>,
        /// Defaults to 10
        miter_limit: Option<f32>,
        /// Defaults to source over
        composite_operation: Option<GlobalCompositeOperation>,
    },
}

#[derive(Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct LineDash {
    pub segments: Vec<u32>,
    pub offset: u32,
}

#[derive(Clone, Copy, Default, Serialize, Deserialize, PartialEq)]
pub struct Shadow {
    pub blur: f32,
    pub paint: Paint,
    pub offset: Vec2,
}

#[derive(Clone, Copy, Default, Serialize, Deserialize, PartialEq)]
pub enum LineJoin {
    #[default]
    Miter,
    Round,
    Bevel,
}

impl From<LineJoin> for &str {
    fn from(value: LineJoin) -> Self {
        match value {
            LineJoin::Miter => "miter",
            LineJoin::Round => "round",
            LineJoin::Bevel => "bevel",
        }
    }
}

#[derive(Clone, Copy, Default, Serialize, Deserialize, PartialEq)]
pub enum LineCap {
    #[default]
    Butt,
    Round,
    Square,
}

impl From<LineCap> for &str {
    fn from(value: LineCap) -> Self {
        match value {
            LineCap::Butt => "butt",
            LineCap::Round => "round",
            LineCap::Square => "square",
        }
    }
}

/// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
#[derive(Clone, Copy, Default, Serialize, Deserialize, PartialEq)]
pub enum GlobalCompositeOperation {
    #[default]
    SourceOver,
    SourceIn,
    SourceOut,
    SourceAtop,
    DestinationOver,
    DestinationIn,
    DestinationOut,
    DestinationAtop,
    Lighter,
    Copy,
    Xor,
    Multiply,
    Screen,
    Overlay,
    Darken,
    Lighten,
    ColorDodge,
    ColorBurn,
    HardLight,
    SoftLight,
    Difference,
    Exclusion,
    Hue,
    Saturation,
    Color,
    Luminosity,
}

impl From<GlobalCompositeOperation> for &str {
    fn from(value: GlobalCompositeOperation) -> Self {
        match value {
            GlobalCompositeOperation::Color => "color",
            GlobalCompositeOperation::ColorBurn => "color-burn",
            GlobalCompositeOperation::ColorDodge => "color-dodge",
            GlobalCompositeOperation::Copy => "copy",
            GlobalCompositeOperation::Darken => "darken",
            GlobalCompositeOperation::DestinationAtop => "destination-atop",
            GlobalCompositeOperation::DestinationIn => "destination-in",
            GlobalCompositeOperation::DestinationOut => "destination-out",
            GlobalCompositeOperation::DestinationOver => "destination-over",
            GlobalCompositeOperation::Difference => "difference",
            GlobalCompositeOperation::Exclusion => "exclusion",
            GlobalCompositeOperation::HardLight => "hard-light",
            GlobalCompositeOperation::Hue => "hue",
            GlobalCompositeOperation::Lighten => "lighten",
            GlobalCompositeOperation::Lighter => "lighter",
            GlobalCompositeOperation::Luminosity => "luminosity",
            GlobalCompositeOperation::Multiply => "multiply",
            GlobalCompositeOperation::Overlay => "overlay",
            GlobalCompositeOperation::Saturation => "saturation",
            GlobalCompositeOperation::Screen => "screen",
            GlobalCompositeOperation::SoftLight => "soft-light",
            GlobalCompositeOperation::SourceAtop => "source-atop",
            GlobalCompositeOperation::SourceIn => "source-in",
            GlobalCompositeOperation::SourceOut => "source-out",
            GlobalCompositeOperation::SourceOver => "source-over",
            GlobalCompositeOperation::Xor => "xor",
        }
    }
}

#[derive(Clone, Copy, Default, Serialize, Deserialize, PartialEq)]
pub enum TextAlign {
    #[default]
    Left,
    Center,
    Right,
}

impl From<TextAlign> for &str {
    fn from(value: TextAlign) -> Self {
        match value {
            TextAlign::Left => "left",
            TextAlign::Center => "center",
            TextAlign::Right => "right",
        }
    }
}

#[derive(Clone, Default, Serialize, Deserialize, PartialEq)]
pub enum TextDrawConfig {
    None,
    /// Simple configuration; black stroke of width factor 0.2, white fill
    #[default]
    Simple,
    Style {
        line_width_factor: f32,
        fill: Paint,
        stroke: Paint,
    },
    Full {
        /// Defaults to 0.2
        line_width_factor: Option<f32>,
        /// Defaults to white
        fill: Option<Paint>,
        /// Defaults to black
        stroke: Option<Paint>,
        /// Defaults to butt
        line_cap: Option<LineCap>,
        /// Defaults to miter
        line_join: Option<LineJoin>,
        /// Defaults to no dashing
        line_dash: Option<LineDash>,
        /// Defaults to no shadow
        shadow: Option<Shadow>,
        /// Defaults to 10
        miter_limit: Option<f32>,
        /// Defaults to center
        align: Option<TextAlign>,
        /// Defaults to source over
        composite_operation: Option<GlobalCompositeOperation>,
    },
}
