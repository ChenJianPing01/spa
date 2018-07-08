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
        /*
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
        */

        let currentUser, peopleDb,
            $t = $('<div/>');
        // 给$t订阅登入、登出事件
        $.gevent.subscribe($t, 'spa-login', () => print('Hello!', arguments, 'testModelPeople!'));
        $.gevent.subscribe($t, 'spa-logout', () => print('Goodbye!', arguments, 'testModelPeople!'));

        // 初始状态
        currentUser = model.people.user;
        peopleDb = model.people.get_db();
        print('currentUser.get_is_anon', currentUser.get_is_anon());
        peopleDb().each((person, idx) => print(person, person.name));

        // 用户登入
        model.people.login('Alfred');
        currentUser = model.people.user;
        print('currentUser.get_is_anon', currentUser.get_is_anon());
        print('currentUser.id', currentUser.id);        
        print('currentUser.cid', currentUser.cid);
        peopleDb().each((person, idx) => print(person, person.name));

        // 用户登出
        model.people.logout();
        peopleDb().each((person, idx) => print(person, person.name));
        currentUser = model.people.user;
        print('currentUser.get_is_anon', currentUser.get_is_anon());
        
    }

    testModelChat() {
        let currentUser, peopleDb,
            $t = $('<div/>');

        // 给$t订阅登入、登出事件
        $.gevent.subscribe($t, 'spa-login', () => print('Hello!', arguments, 'testModelChat!'));
        $.gevent.subscribe($t, 'spa-listchange', () => print('*Listchange!', arguments, 'testModelChat!'));

        // 初始状态
        currentUser = model.people.user;
        peopleDb = model.people.get_db();
        print('currentUser.get_is_anon', currentUser.get_is_anon());
        peopleDb().each((person, idx) => print(person, person.name));

        // 匿名登录，将出现警告信息
        model.chat.join(); 

        // 用户登入
        model.people.login('Fred');
        peopleDb = model.people.get_db();
        peopleDb().each((person, idx) => print(person, person.name));

        model.chat.join(); // 成功信息

        peopleDb = model.people.get_db();
        peopleDb().each((person, idx) => print(person, person.name));

    }
}

const spa = new Spa($('#spa'));

// 控制台观察调试
const print = console.log;
//spa.testModelPeople();

spa.testModelChat();

