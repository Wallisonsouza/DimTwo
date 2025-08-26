import { System } from "@engine/core/base/System";
import { WebKeyboardInput } from "@engine/modules/webInput/WebKeyboardInput";
import { WebMouseInput } from "@engine/modules/webInput/WebMouseInput";

export class Input {
    static readonly mouse = new WebMouseInput();
    static readonly keyboard = new WebKeyboardInput();

}

export class InputSystem extends System {
    lateUpdate() {
         Input.keyboard.clear();
        Input.mouse.clear();
       
    }
}