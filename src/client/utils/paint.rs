use wasm_bindgen::JsValue;

use crate::shared::util::paint::Paint;

impl From<Paint> for JsValue {
    fn from(value: Paint) -> Self {
        JsValue::from_str(&String::from(value))
    }
}