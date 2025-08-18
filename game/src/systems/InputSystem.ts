import { System } from "@engine/core/base/System";
import { InputBuilder } from "@engine/interfaces/Input";
import { WebKeyboardInput } from "@engine/modules/webInput/WebKeyboardInput";
import { WebMouseInput } from "@engine/modules/webInput/WebMouseInput";


export const Input = new InputBuilder(new WebKeyboardInput(), new WebMouseInput());

export class InputSystem extends System {
    start() {
        Input.enable();
    }

    lateUpdate() {
        Input.clear();
    }
}