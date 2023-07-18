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
            }
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
        })
    }

    incClicksCount() {
        this.state.clicksCount += 1;
    }

    syncStateFromServer() {
        return fetch(serverOrigin + '/api/user/auth')
            .then(async (res) => {
                if (res.ok) {
                    this.state = {...this.state, ...(await res.json())};
                }
            });
    }
}

export const user = new ActiveUser();