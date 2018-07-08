/* shell模块 */

import { util } from './spa.util.js';
import { model } from './spa.model.js';
import { Chat } from './spa.chat.js';
export { shell };

class Shell {

    constructor() {
        this.config = {
            anchor_schema: {
                chat: { opened: true, closed: true }
            },
            main_html:
                `<div class="spa-shell-head">
                    <div class="spa-shell-head-logo"></div>
                    <div class="spa-shell-head-acct"></div>
                    <div class="spa-shell-head-search"></div>
                </div>
                <div class="spa-shell-main">
                    <div class="spa-shell-main-nav"></div>
                    <div class="spa-shell-main-content"></div>
                </div>
                <div class="spa-shell-foot"></div>
                <div class="spa-shell-modal"></div>`,
            
            resize_interval: 300
        };

        this.state = { 
            $container: undefined,
            anchor: {},
            resize_idto: undefined
        };
        this.jqueryBuf = {}; // 缓存jQuery集合
    }

    // 复制锚组件
    copyAnchor() {
        return $.extend(true, {}, this.state.anchor);
    }

    // 设置jQuery缓冲
    setJqueryBuf() {
        let $container = this.state.$container;
        this.jqueryBuf = {
            $container: $container,
            $acct: $container.find('.spa-shell-head-acct'),
            $nav: $container.find('.spa-shell-main-nav')
        };
    }

    // 改变锚组件部分内容
    changeAnchorPart(arg_map) {
        let anchor_revise = this.copyAnchor(),
            bool_return = true,
            key_name_dep;

        // 合并改变内容
        for (let key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name) && key_name.indexOf('_') !== 0) {
                anchor_revise[key_name] = arg_map[key_name];
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete anchor_revise[key_name_dep];
                    delete anchor_revise['_s' + key_name_dep];
                }
            }
        }

        // 设置锚组件
        try { $.uriAnchor.setAnchor(anchor_revise); }
        catch (error) {
            $.uriAnchor.setAnchor(this.state.anchor, null, true);
            bool_return = false;
        }

        return bool_return;
    }

    // 定义jQuery的hashchange事件处理程序
    onHashchange(event) {
        let anchor_proposed, _s_chat_previous,
            _s_chat_proposed,
            is_ok = true,
            anchor_previous = this.copyAnchor();

        // 读取锚并解析为一个映射
        try { anchor_proposed = $.uriAnchor.makeAnchorMap(); }
        catch (error) {
            $.uriAnchor.setAnchor(anchor_previous, null, true);
            return false;
        }
        this.state.anchor = anchor_proposed;

        _s_chat_previous = anchor_previous._s_chat;
        _s_chat_proposed = anchor_proposed._s_chat;

        // 调整chat组件
        if (!anchor_previous || _s_chat_previous !== _s_chat_proposed) {
            let chat_proposed = anchor_proposed.chat;
            switch (chat_proposed) {
                case 'opened':
                    is_ok = this.chat.setSliderPosition('opened');
                    break;
                case 'closed':
                    is_ok = this.chat.setSliderPosition('closed');
                    break;
                default:
                    this.chat.setSliderPosition('closed');
                    delete anchor_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_proposed, null, true);
            }
        }
        if (!is_ok) {
            if (anchor_previous) {
                $.uriAnchor.setAnchor(anchor_previous, null, true);
                this.state.anchor = anchor_previous;
            } else {
                delete anchor_proposed.chat;
                $.uriAnchor.setAnchor(anchor_proposed, null, true);
            }
        }
        return false;
    }

    // 窗口尺寸调整事件处理
    onResize() {
        if (this.state.resize_idto) {return true;}

        this.chat.handleResize();
        this.state.resize_idto = setTimeout(
            () => this.state.resize_idto = undefined,
            this.config.resize_interval
        );
        return true;
    }

    // 点击账户元素，处理登入或登出事件
    onTapAcct(event) {
        let acct_text, user_name,
            user = model.people.user;

        if (user.get_is_anon()) {
            user_name = prompt('登录');
            model.people.login(user_name);
            this.jqueryBuf.$acct.text('处理中...');
        } else {
            model.people.logout();
        }
        return false;
    }

    // 登入事件处理
    onLogin(event, login_user) {
        this.jqueryBuf.$acct.text(login_user.name);
    }

    // 登出事件处理
    onLogout(event, logout_user) {
        this.jqueryBuf.$acct.text('登录');
    }

    // 设置chat的锚
    setChatAnchor(position_type) {
        return this.changeAnchorPart({ chat: position_type });
    }

    // 初始化模块
    initModule($container) {
        // 载入文档内容
        this.state.$container = $container;
        $container.html(this.config.main_html);
        this.setJqueryBuf();
        // 配置uriAnchor插件
        $.uriAnchor.configModule({ schema_map: this.config.anchor_schema });

        // 配置和初始化chat模块
        this.chat = new Chat();
        this.chat.configModule({
            shell: this,
            chat_model: model.chat,
            people_model: model.people
        });
        this.chat.initModule(this.jqueryBuf.$container);

        // 绑定hashchange事件处理程序，并立即触发它
        $(window)
            .on('resize', this.onResize.bind(this))
            .on('hashchange', this.onHashchange.bind(this))
            .trigger('hashchange');

        // 订阅事件
        $.gevent.subscribe($container, 'spa-login', this.onLogin.bind(this));
        $.gevent.subscribe($container, 'spa-logout', this.onLogout.bind(this));
        this.jqueryBuf.$acct
            .text('登录')
            .on('utap', this.onTapAcct.bind(this));

    }

}

const shell = new Shell();