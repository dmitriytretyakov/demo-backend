import { _decorator, Component, Node, director, sys } from 'cc';
import {user} from "db://assets/scripts/services/ActiveUser";
const { ccclass, property } = _decorator;

@ccclass('Init')
export class Init extends Component {
    start() {
        user.auth().then(() => {
            user.syncStateFromServer().then(() => {
                director.loadScene('counter');
            });
        });
    }
}

