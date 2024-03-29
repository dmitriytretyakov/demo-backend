import {sys} from 'cc';

const serverOrigin = 'http://localhost:8000';

class ActiveUser {
    token?: string;
    state: { clicksCount: number } = {clicksCount: 0};

    auth(): Promise<void> {
        return new Promise((resolve, reject) => {
            const storage_token = sys.localStorage.getItem('token');
            if (storage_token) {
                this.token = storage_token;
                resolve();
            } else {
                fetch(serverOrigin + '/api/user/auth')
                    .then(async (res) => {
                        if (res.ok) {
                            const new_token = (await res.json()).token;
                            sys.localStorage.setItem('token', new_token);
                            this.token = new_token;
                            resolve();
                        } else {
                            alert('Что-то случилось, сегодня хорошо не делаем');
                            reject();
                        }
                    });
            }
        })
    }

    incClicksCount() {
        this.state.clicksCount += 1;
        this.setClicksCountToSend(
            this.getClicksCountToSend() + 1
        );
    }

    getClicksCountToSend() {
        let clicksCountToSend = parseInt(sys.localStorage.getItem('clicks_count_to_send'));
        if (!clicksCountToSend) {
            clicksCountToSend = 0;
        }
        return clicksCountToSend;
    }

    setClicksCountToSend(value: number) {
        sys.localStorage.setItem('clicks_count_to_send', value.toString());
    }

    syncStateFromServer() {
        return fetch(serverOrigin + '/api/user/state', {
            headers: new Headers({
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            })
        })
            .then(async (res) => {
                if (res.ok) {
                    this.state = {...this.state, ...(await res.json())};
                }
            });
    }

    sendClicksCount() {
        return fetch(serverOrigin + '/api/user/state', {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({clicks_count: this.getClicksCountToSend()})
        })
            .then(async (res) => {
                if (res.ok) {
                    this.state = {...this.state, ...(await res.json())};
                }
                return res;
            });
    }
}

export const user = new ActiveUser();