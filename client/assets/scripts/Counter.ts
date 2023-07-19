import {_decorator, Component, LabelComponent} from 'cc';
import {user} from "db://assets/scripts/services/ActiveUser";

const {ccclass, property} = _decorator;

@ccclass('Counter')
export class Counter extends Component {
    value = -1;
    sending = false;

    start() {
        this.schedule(() => {
            if (!this.sending) {
                const last_value = user.getClicksCountToSend();
                if (last_value) {
                    this.sending = true;
                    user
                        .sendClicksCount()
                        .then((res) => {
                            this.sending = false;
                            if (res.ok) {
                                console.log(user.getClicksCountToSend() - last_value)
                                user.setClicksCountToSend(user.getClicksCountToSend() - last_value);
                            }
                        })
                        .catch(() => {
                            this.sending = false;
                            console.log('Что-то не так');
                            // alert('Сегодня без хорошо, что-то пошло не так при отправке количества новых кликов')
                        });
                }
            }
        }, 1);
    }

    update(deltaTime: number) {
        if (user.state.clicksCount !== this.value) {
            this.value = user.state.clicksCount;
            const label = this.getComponent(LabelComponent);
            label.string = 'Сделано хорошо раз: ' + this.value;
        }
    }
}

