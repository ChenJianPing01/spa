/* spa.shell.js */

export { shell };
 
let
    // 配置变量
    configMap = {
        anchor_schema_map: {
            chat: { open: true, closed: true }
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
            <div class="spa-shell-chat"></div>
            <div class="spa-shell-modal"></div>`,
        chat_extend_time: 200,
        chat_retract_time: 300,
        chat_extend_height: 450,
        chat_retract_height: 15,
        chat_extended_title: '点击收起',
        chat_retracted_title: '点击展开'
    },

    // 状态变量
    stateMap = {
        $container: null,
        anchor_map: {},
        is_chat_retracted: true
    },

    // 缓存jQuery集合变量
    jqueryMap = {};

// 设置缓存jQuery集合
function setJqueryMap() {
    let $container = stateMap.$container;
    jqueryMap = {
        $container: $container,
        $chat: $container.find('.spa-shell-chat')
    };
}

// 切换聊天组件状态
function toggleChat(do_extend, callback) {
    let
        px_chat_ht = jqueryMap.$chat.height(),
        is_open = px_chat_ht === configMap.chat_extend_height,
        is_closed = px_chat_ht === configMap.chat_retract_height,
        is_sliding = !is_open && !is_closed;

    if (is_sliding) { return false; }

    if (do_extend) {
        jqueryMap.$chat.animate(
            { height: configMap.chat_extend_height },
            configMap.chat_extend_time,
            function () {
                jqueryMap.$chat.attr('title', configMap.chat_extended_title);
                stateMap.is_chat_retracted = false;
                if (callback) { callback(jqueryMap.$chat); }
            }
        );
    } else {
        jqueryMap.$chat.animate(
            { height: configMap.chat_retract_height },
            configMap.chat_retract_time,
            function () {
                jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
                stateMap.is_chat_retracted = true;
                if (callback) { callback(jqueryMap.$chat); }
            }
        );
    }
    return true;
}

// 复制锚组件
function copyAnchorMap() {
    return $.extend(true, {}, stateMap.anchor_map);
}

// 改变锚组件部分内容
function changeAnchorPart(arg_map) {
    let anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        //key_name, 
        key_name_dep;

    // 合并改变内容
    for (let key_name in arg_map) {
        if (arg_map.hasOwnProperty(key_name) && key_name.indexOf('_') !== 0) {
            anchor_map_revise[key_name] = arg_map[key_name];
            key_name_dep = '_' + key_name;
            if (arg_map[key_name_dep]) {
                anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
            } else {
                delete anchor_map_revise[key_name_dep];
                delete anchor_map_revise['_s' + key_name_dep];
            }
        }
    }

    // 设置锚组件
    try {
        $.uriAnchor.setAnchor(anchor_map_revise);
    }
    catch (error) {
        $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
        bool_return = false;
    }

    return bool_return;
}

// 定义jQuery的hashchange事件处理程序
function onHashchange(event) {
    let anchor_map_previous = copyAnchorMap(),
        anchor_map_proposed,
        _s_chat_previous, 
        _s_chat_proposed,
        s_chat_proposed;

    // 读取锚并解析为一个映射
    try {
        anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    }
    catch (error) {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // 调整chat组件
    if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
        s_chat_proposed = anchor_map_proposed.chat;
        switch (s_chat_proposed) {
            case 'open':
                toggleChat(true);
                break;
            case 'closed':
                toggleChat(false);
                break;
            default:
                toggleChat(false);
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
        }
    }
    return false;    
}

// 定义clickChat事件处理程序
function onClickChat(event) {
    // 仅修改锚组件的chat参数
    changeAnchorPart({chat: (stateMap.is_chat_retracted ? 'open' : 'closed')});
    return false;
}

// 初始化本模块
function initModule($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
        .attr('title', configMap.chat_retracted_title)
        .click(onClickChat);
    stateMap.is_chat_retracted = false;

    // 配置uriAnchor插件
    $.uriAnchor.configModule({schema_map: configMap.anchor_schema_map});    

    // 绑定hashchange事件处理程序，并立即触发它
    $(window)
        .bind('hashchange', onHashchange)
        .trigger('hashchange');

    // 测试toggleChat
    setTimeout(function () { toggleChat(true); }, 1000);
    setTimeout(function () { toggleChat(false); }, 2000);
}

const shell = { initModule: initModule };
