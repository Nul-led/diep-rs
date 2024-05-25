import Input from "./core/Input";
import Viewport from "./core/Viewport";

const render = () => {
    Input.startFrame();
    Viewport.startFrame();
    Viewport.renderComponents();
    Input.endFrame();
    requestAnimationFrame(render);
}

document.fonts.onloadingdone = () => {
    Input.init();
    requestAnimationFrame(render);
}