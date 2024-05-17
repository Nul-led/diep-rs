


/*
needed refs:
    Text (names, scores)
    Progressbar (health)
    
*/

use wasm_bindgen::prelude::*;
use web_sys::js_sys;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = Widget, typescript_type = "Widget")]
    pub type Widget;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends = Widget, extends = js_sys::Object , )]
    pub type Text;


    //#[wasm_bindgen(structural , method , setter , js_class = "Text" , js_name = height)]

}