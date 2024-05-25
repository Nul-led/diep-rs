import Input from "./core/Input";
import Viewport from "./core/Viewport";





const render = () => {
    Input.startFrame();
    Viewport.render();
    Input.endFrame();
    requestAnimationFrame(render);
}

Input.init();
requestAnimationFrame(render);