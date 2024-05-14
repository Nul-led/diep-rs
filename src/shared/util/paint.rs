use crate::shared::definitions::colors::Colors;

#[derive(Clone, Copy, Debug)]
pub enum Paint {
    /// Using this variant in networked components is highly recommended as we don't need to send over the color to the client
    ColorId(Colors),
    RGBA(u8, u8, u8, f32),
    RGB(u8, u8, u8),
    // TODO Gradient
}

impl Paint {
    pub fn blend_with(&self, paint: Paint, factor: f32) -> Paint {
        match paint {
            Paint::ColorId(color) => self.blend_with(Paint::from(color), factor),
            Paint::RGB(r1, g1, b1) => {
                match self {
                    Paint::ColorId(color) => Paint::from(*color).blend_with(paint, factor),
                    Paint::RGB(r2, g2, b2) => Paint::RGB(
                        (r1 as f32 * factor + *r2 as f32 * (1.0 - factor)) as u8,
                        (g1 as f32 * factor + *g2 as f32 * (1.0 - factor)) as u8,
                        (b1 as f32 * factor + *b2 as f32 * (1.0 - factor)) as u8,
                    ),
                    Paint::RGBA(r2, g2, b2, alpha2) => Paint::RGBA(
                        (r1 as f32 * factor + *r2 as f32 * (1.0 - factor)) as u8,
                        (g1 as f32 * factor + *g2 as f32 * (1.0 - factor)) as u8,
                        (b1 as f32 * factor + *b2 as f32 * (1.0 - factor)) as u8,
                        *alpha2
                    )
                }
            }
            Paint::RGBA(r1, g1, b1, alpha1) => {
                match self {
                    Paint::ColorId(color) => Paint::from(*color).blend_with(paint, factor),
                    Paint::RGB(r2, g2, b2) => Paint::RGBA(
                        (r1 as f32 * factor + *r2 as f32 * (1.0 - factor)) as u8,
                        (g1 as f32 * factor + *g2 as f32 * (1.0 - factor)) as u8,
                        (b1 as f32 * factor + *b2 as f32 * (1.0 - factor)) as u8,
                        alpha1
                    ),
                    Paint::RGBA(r2, g2, b2, alpha2) => Paint::RGBA(
                        (r1 as f32 * factor + *r2 as f32 * (1.0 - factor)) as u8,
                        (g1 as f32 * factor + *g2 as f32 * (1.0 - factor)) as u8,
                        (b1 as f32 * factor + *b2 as f32 * (1.0 - factor)) as u8,
                        alpha1 * factor + *alpha2 as f32 * (1.0 - factor)
                    )
                }
            }
        }
    }
}

impl Default for Paint {
    fn default() -> Self {
        Self::ColorId(Colors::default())
    }
}

impl From<Paint> for String {
    fn from(value: Paint) -> Self {
        match value {
            Paint::ColorId(color) => Paint::from(color).into(),
            Paint::RGBA(r, g, b, a) => format!("rgba({},{},{},{})", r, g, b, a),
            Paint::RGB(r, g, b) => format!("rgb({},{},{})", r, g, b),
        }
    }
}