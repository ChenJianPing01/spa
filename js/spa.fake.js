/* spa.fake.js */

export {fake};

class Fake {

    constructor() {
        this.fakeIdSerial = 5;
    }

    getPersonList() {
        return [
            {name: 'Betty', ___id: 'id_01',
            css_map: {
                top: 20,
                left: 20,
                'background-color': 'rgb(128, 128, 128)'
            }},
            {name: 'Mike', ___id: 'id_02',
            css_map: {
                top: 60,
                left: 20,
                'background-color': 'rgb(128, 255, 128)'
            }},
            {name: 'Pebbles', ___id: 'id_03',
            css_map: {
                top: 100,
                left: 20,
                'background-color': 'rgb(128, 192, 192)'
            }},
            {name: 'Wilma', ___id: 'id_04',
            css_map: {
                top: 140,
                left: 20,
                'background-color': 'rgb(192, 128, 128)'
            }}
        ];
    }

    mockSio() {

    }

    

}

const fake = new Fake();