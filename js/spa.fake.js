/* spa.fake.js */

export { fake };

class MockSio {
    constructor(fake) {
        this.fake = fake;
        this.callback_map = {};
        this.listchange_idto = undefined;
        this.send_listchange();
    }

    // 给某消息类型注册回调函数，回调函数的参数是消息数据
    on(msg_type, callback) {
        this.callback_map[msg_type] = callback;
    }

    //模拟向服务器发送消息。当接收后，为模拟网络延时，等待3秒钟，然后再调用回调函数
    emit(msg_type, data) {
        let person_map;
        if (msg_type === 'adduser' && this.callback_map.userupdate) {
            setTimeout(() => {
                person_map = {
                    ___id: this.fake.makeFakeId(),
                    name: data.name,
                    css_map: data.css_map
                }
                this.fake.personList.push(person_map);
                this.callback_map.userupdate([person_map]);
            }, 3000);
        }
    }

    send_listchange() {
        this.listchange_idto = setTimeout(() => {
            if (this.callback_map.listchange) {
                this.callback_map.listchange([this.fake.personList]);
                this.listchange_idto = undefined;
            } else {
                this.send_listchange();
            }
        }, 1000);
    }

}


class Fake {

    constructor() {
        this.fakeIdSerial = 5;
        this.mockSio = null;
        this.personList = [
            {
                ___id: 'id_01',
                name: 'Betty',
                css_map: {
                    top: 20,
                    left: 20,
                    'background-color': 'rgb(128, 128, 128)'
                }
            },
            {
                ___id: 'id_02',
                name: 'Mike',
                css_map: {
                    top: 60,
                    left: 20,
                    'background-color': 'rgb(128, 255, 128)'
                }
            },
            {
                ___id: 'id_03',
                name: 'Pebbles',
                css_map: {
                    top: 100,
                    left: 20,
                    'background-color': 'rgb(128, 192, 192)'
                }
            },
            {
                ___id: 'id_04',
                name: 'Wilma',
                css_map: {
                    top: 140,
                    left: 20,
                    'background-color': 'rgb(192, 128, 128)'
                }
            }
        ];
    }

    makeFakeId() {
        return 'id_' + String(this.fakeIdSerial++);
    }




    initModule() {
        this.mockSio = new MockSio(this);
    }

}

const fake = new Fake();
fake.initModule();