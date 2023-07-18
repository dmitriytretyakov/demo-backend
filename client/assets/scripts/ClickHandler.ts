import { _decorator, Component, Node, NodeEventType } from 'cc';
import {user} from "db://assets/scripts/services/ActiveUser";
const { ccclass, property } = _decorator;

@ccclass('ClickHandler')
export class ClickHandler extends Component {
    start() {
        this.node.on(NodeEventType.TOUCH_START, () => {
            user.incClicksCount();
        });
    }

    update(deltaTime: number) {
        
    }
}

