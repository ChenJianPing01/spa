/* model模块 */

import { util } from './spa.util.js';
import { fake } from './spa.fake.js';
import { data } from './spa.data.js';
export { model };

class Person {
    constructor(people, person_map) {
        if (person_map.cid === undefined || !person_map.name) {
            throw '客户端人员id或名字是必需的信息。//client id and name required';
        }

        Object.assign(this, person_map);

        people.addPerson(this);
        this.people = people;
    }

    static makePersonMap(person_s) {
        return {
            cid: person_s.___id,
            id: person_s.___id,
            css_map: person_s.css_map,
            name: person_s.name
        };
    }

    get_is_user() {
        return this.cid === this.people.user.cid;
    }

    get_is_anon() {
        return this.cid === this.people.anon_user.cid;
    }

}


class People {
    constructor(model) {
        this.model = model;
        this.anon_id = 'a0';
        this.cid_serial = 0;

        this.cid_map = {};
        this.person_db = TAFFY();

        this.anon_user = null;
        this.user = null;
    }

    initAnonUser() {
        this.anon_user = new Person(
            this, {
                cid: this.anon_id,
                id: this.anon_id,
                name: '匿名'
            });
        this.user = this.anon_user;
    }

    makeCid() {
        return 'c' + String(this.cid_serial++);
    }

    clearPersonDb() {
        this.cid_map = {};
        this.person_db = TAFFY();

        this.initAnonUser();
        if (this.user) { this.addPerson(this.user); } // 如有用户登入，则恢复
    }

    removePerson(person) {
        if (!person) { return false; }
        if (person.id === this.anon_id) { return false; }

        this.person_db({ cid: person.cid }).remove();
        if (person.cid) { delete this.cid_map[person.cid]; }
        return true;
    }

    addPerson(person) {
        this.cid_map[person.cid] = person;
        this.person_db.insert(person);
    }

    get_by_cid(cid) {
        return this.cid_map[cid];
    }

    get_db() {
        return this.person_db;
    }

    get_cid_map() {
        return this.cid_map;
    }

    login(name) {
        let sio = this.model.isFakeData ? fake.mockSio : data.getSio();

        this.user = new Person({
            cid: this.makeCid(),
            css_map: { top: 25, left: 25, 'background-color': '#8f8' },
            name: name
        });

        sio.on('userupdate', this.completeLogin);
        sio.emit('adduser', {
            cid: this.user.cid,
            css_map: this.user.css_map,
            name: this.user.name
        });
    }

    completeLogin(user_list) {
        let user = user_list[0];
        
        delete this.cid_map[user.cid];
        this.user.cid = user.___id;
        this.user.id = user.___id;
        this.user.css_map = user.css_map;
        this.cid_map[user.___id] = this.user;

        // 加入chat模块后，发布登入事件
        $.gevent.publish('spa-login', [this.user]);
    }

    logout() {
        let is_removed,
            user = this.user;

        is_removed = this.removePerson(user);
        this.user = this.anon_user;

        $.gevent.publish('spa-logout', [user]);
        return is_removed;
    }

}


class Model {

    constructor() {
        this.isFakeData = true;
    }

    initModule() {
        this.people = new People(this);
        this.people.initAnonUser();

        if (this.isFakeData) {
            fake.getPersonList().forEach(
                (person_s) => new Person(this.people, Person.makePersonMap(person_s))
            );
        }
    }

}

const model = new Model();