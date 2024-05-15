use std::ops::{Deref, DerefMut};

use wasm_bindgen::JsCast;
use web_sys::{
    CanvasRenderingContext2d, HtmlCanvasElement, OffscreenCanvas, OffscreenCanvasRenderingContext2d,
};

/* Disclaimer: While there are a few conversions marked as unsafe, they are safe as long as you treat the converted context as the conversion target (ie not accessing unsupported methods and properties) */

#[derive(Clone, Debug)]
pub struct Context(CanvasRenderingContext2d);

impl Context {
    pub fn new(canvas: HtmlCanvasElement) -> Self {
        Self(unsafe {
            canvas
                .get_context("2d")
                .unwrap()
                .unwrap()
                .unchecked_into::<CanvasRenderingContext2d>()
        })
    }
}

impl Deref for Context {
    type Target = CanvasRenderingContext2d;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Context {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl From<CanvasRenderingContext2d> for Context {
    fn from(value: CanvasRenderingContext2d) -> Self {
        Self(value)
    }
}

unsafe impl Send for Context {}
unsafe impl Sync for Context {}

#[derive(Clone, Debug)]
pub struct OffscreenContext(OffscreenCanvasRenderingContext2d);

impl OffscreenContext {
    pub fn new() -> Self {
        Self::new_with_canvas(OffscreenCanvas::new(1, 1).unwrap())
    }

    pub fn new_with_canvas(canvas: OffscreenCanvas) -> Self {
        Self(unsafe {
            canvas
                .get_context("2d")
                .unwrap()
                .unwrap()
                .unchecked_into::<OffscreenCanvasRenderingContext2d>()
        })
    }
}

impl Default for OffscreenContext {
    fn default() -> Self {
        let ctx = Self::new();
        //ctx.set_image_smoothing_enabled(false);
        ctx
    }
}

impl Deref for OffscreenContext {
    type Target = OffscreenCanvasRenderingContext2d;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for OffscreenContext {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl From<OffscreenCanvasRenderingContext2d> for OffscreenContext {
    fn from(value: OffscreenCanvasRenderingContext2d) -> Self {
        Self(value)
    }
}

unsafe impl Send for OffscreenContext {}
unsafe impl Sync for OffscreenContext {}

// The following conversions *kinda* work since CanvasRenderingContext2d and OffscreenCanvasRenderingContext2d have an almost identical api

impl From<OffscreenContext> for Context {
    fn from(value: OffscreenContext) -> Self {
        Self(unsafe { value.0.unchecked_into::<CanvasRenderingContext2d>() })
    }
}

impl From<Context> for OffscreenContext {
    fn from(value: Context) -> Self {
        Self(unsafe {
            value
                .0
                .unchecked_into::<OffscreenCanvasRenderingContext2d>()
        })
    }
}
