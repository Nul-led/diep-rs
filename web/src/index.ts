import Input from "./core/Input";
import Viewport from "./core/Viewport";
import * as ABI from "./core/ABI";

ABI.Component;

document.fonts.onloadingdone = () => {
    Input.init();
}