/* 主模块 */

import  { model } from './spa.model.js';
import { shell } from './spa.shell.js';

class Spa {

    constructor($container) {
        model.initModule();
        shell.initModule($container);
    }

    // 控制台观察调试    
    testModelPeople() {
        let peopleDb = model.people.get_db(),
            peopleList = peopleDb().get();

        print('peopleList', peopleList);        
        //peopleDb().each((person, idx) => print(person, person.name));

        let person = peopleDb({cid: 'id_03'}).first();
        print(person, person.name);
        print('person.css_map', JSON.stringify(person.css_map));
        print('person.get_is_anon()', person.get_is_anon());
        
        let person0 = peopleDb({cid: 'a0'}).first();
        print(person0, person0.name);
        print('person.css_map', JSON.stringify(person0.css_map));
        print('person.get_is_anon()', person0.get_is_anon());

        let personCidMap = model.people.get_cid_map();
        print(personCidMap, personCidMap['a0'].name);

    }
}

const spa = new Spa($('#spa'));

// 控制台观察调试
const print = console.log;
spa.testModelPeople();

