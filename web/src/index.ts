import Input from "./core/Input";
import Viewport from "./core/Viewport";

const render = () => {
    Input.startFrame();
    Viewport.render();
    Input.endFrame();
    requestAnimationFrame(render);
}

document.fonts.onloadingdone = () => {
    Input.init();
    requestAnimationFrame(render);
}