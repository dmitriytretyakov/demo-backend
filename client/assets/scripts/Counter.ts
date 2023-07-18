import { _decorator, Component, Node, LabelComponent } from 'cc';
import {user} from "db://assets/scripts/services/ActiveUser";
const { ccclass, property } = _decorator;

@ccclass('Counter')
export class Counter extends Component {
    value = -1;
    start() {

    }

    update(deltaTime: number) {
        if(user.state.clicksCount !== this.value) {
            this.value = user.state.clicksCount;
            const label = this.getComponent(LabelComponent);
            label.string = 'Сделано хорошо раз: ' + this.value;
        }
    }
}

