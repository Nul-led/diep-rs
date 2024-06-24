use wasm_bindgen::JsValue;
use web_sys::js_sys::Array;

use crate::shared::util::{drawinfo::DrawConfig, paint::Paint};

use super::context::{Context, OffscreenContext};

impl From<Paint> for JsValue {
    fn from(value: Paint) -> Self {
        JsValue::from_str(&String::from(value))
    }
}

impl DrawConfig {
    pub fn apply_to_ctx(&self, ctx: &Context) {
        if let Some(fill_style) = self.fill_style {
            ctx.set_fill_style(&fill_style.into())
        }

        if let Some(stroke_style) = self.stroke_style {
            ctx.set_stroke_style(&stroke_style.into())
        }

        if let Some(line_width) = self.line_width {
            ctx.set_line_width(line_width as f64);
        }

        if let Some(line_cap) = self.line_cap {
            ctx.set_line_cap(line_cap);
        }

        if let Some(line_join) = self.line_join {
            ctx.set_line_join(line_join);
        }

        if let Some(line_dash) = &self.line_dash {
            ctx.set_line_dash(&line_dash.segments.iter().map(|x| JsValue::from(*x)).collect::<Array>());
            ctx.set_line_dash_offset(line_dash.offset as f64);
        }

        if let Some(shadow) = self.shadow {
            ctx.set_shadow_blur(shadow.blur as f64);
            ctx.set_shadow_color(&String::from(shadow.paint));
            ctx.set_shadow_offset_x(shadow.offset.x as f64);
            ctx.set_shadow_offset_y(shadow.offset.y as f64);
        }

        if let Some(miter_limit) = self.miter_limit {
            ctx.set_miter_limit(miter_limit as f64);
        }

        if let Some(text_align) = self.text_align {
            ctx.set_text_align(text_align);
        }

        if let Some(composite_operation) = self.composite_operation {
            ctx.set_global_composite_operation(composite_operation);
        }

        if let Some(font) = &self.font {
            ctx.set_font(font);
        }
    }

    pub fn apply_to_offscreen_ctx(&self, ctx: &OffscreenContext) {
        self.apply_to_ctx(&ctx.into())
    }
}