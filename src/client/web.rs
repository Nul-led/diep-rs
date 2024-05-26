


/*
needed refs:
    Text (names, scores)
    Progressbar (health)
    
*/

use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = Minimap)]
    pub type Minimap;

    #[wasm_bindgen(getter, js_name = sizeX)]
    pub fn size_x(this: &Minimap) -> f32;

    #[wasm_bindgen(setter, js_name = sizeX)]
    pub fn set_size_x(this: &Minimap, sizeX: f32);

    #[wasm_bindgen(getter, js_name = sizeY)]
    pub fn size_y(this: &Minimap) -> f32;

    #[wasm_bindgen(setter, js_name = sizeY)]
    pub fn set_size_y(this: &Minimap, sizeY: f32);

    #[wasm_bindgen(method, js_name = getBufferCtx)]
    pub fn get_buffer_ctx(this: &Minimap) -> CanvasRenderingContext2d;
}

#[wasm_bindgen]
extern "C" {
    pub type Viewport;

    #[wasm_bindgen(static_method_of = Viewport, getter = width)]
    pub fn viewport_width() -> f32;

    #[wasm_bindgen(static_method_of = Viewport, getter = height)]
    pub fn viewport_height() -> f32;

    #[wasm_bindgen(static_method_of = Viewport, getter = guiScale)]
    pub fn gui_scale() -> f32;

    #[wasm_bindgen(static_method_of = Viewport, getter = guiZoomFactor)]
    pub fn gui_zoom_factor() -> f32;

    #[wasm_bindgen(static_method_of = Viewport, getter = guiZoomChanged)]
    pub fn gui_zoom_changed() -> bool;

    #[wasm_bindgen(static_method_of = Viewport, js_name = getCtx)]
    pub fn get_ctx() -> CanvasRenderingContext2d;

    #[wasm_bindgen(static_method_of = Viewport, js_name = startFrame)]
    pub fn system_viewport_start_frame();

    #[wasm_bindgen(static_method_of = Viewport, js_name = renderComponents)]
    pub fn system_viewport_render_components();

    #[wasm_bindgen(static_method_of = Viewport, js_name = endFrame)]
    pub fn system_viewport_end_frame();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = enableComponents)]
    pub fn enable_components(components: Vec<Component>);

    #[wasm_bindgen(js_name = disableComponents)]
    pub fn disable_components(components: Vec<Component>);

    #[wasm_bindgen(js_name = setAppInfoHeader)]
    pub fn set_app_info_header(text: &str);

    #[wasm_bindgen(js_name = setAppInfoBody)]
    pub fn set_app_info_body(text: &str);

    // attributes

    #[wasm_bindgen(js_name = setChangelog)]
    pub fn set_changelog(text: &str);

    // classes

    // class tree

    // console

    // fadeout

    // game modes

    #[wasm_bindgen(js_name = setInfoHeader)]
    pub fn set_info_header(text: &str);

    #[wasm_bindgen(js_name = setInvite)]
    pub fn set_invite(link: &str);

    #[wasm_bindgen(js_name = getMinimap)]
    pub fn get_minimap() -> Option<Minimap>;

    // notifications

    // player stats

    #[wasm_bindgen(js_name = setPlayerStatusLevelbarText)]
    pub fn set_player_status_levelbar_text(text: &str);

    #[wasm_bindgen(js_name = setPlayerStatusScorebarText)]
    pub fn set_player_status_scorebar_text(text: &str);

    #[wasm_bindgen(js_name = setPlayerStatusPlayerName)]
    pub fn set_player_status_player_name(name: &str);

    #[wasm_bindgen(js_name = setPlayerStatusRenderScorebar)]
    pub fn set_player_status_render_scorebar(renderScorebar: bool);
}

/* 
export interface ABI {
    enableComponents(components: Component[]): void;
    disableComponents(components: Component[]): void;

    setAppInfoHeader(text: string): void;
    setAppInfoBody(text: string): void;
    // attributes
    setChangelog(text: string): void;
    // classes
    // class tree
    // console
    // fadeout
    // game modes
    setInfoHeader(text: string): void;
    setInvite(link: string): void;
    getMinimap(): Minimap | null;
    // notifications
    // player stats
    setPlayerStatusLevelbarText(text: string): void;
    setPlayerStatusScorebarText(text: string): void;
    setPlayerStatusPlayerName(name: string): void;
    setPlayerStatusRenderScorebar(renderScorebar: boolean): void;
    // scoreboard
    // spawnmenu

    getViewport(): Viewport;
    getInputs(): Input;
}*/

#[wasm_bindgen]
#[derive(Copy, Clone, Hash, PartialEq, Eq)]
pub enum Component {
    AppInfo,
    Attributes,
    Changelog,
    Classes,
    ClassTree,
    Console,
    Fadeout,
    GameModes,
    InfoHeader,
    Invite,
    Minimap,
    Notifications,
    PlayerStats,
    PlayerStatus,
    Scoreboard,
    SpawnMenu,
}