/* spa.chat.js */

export { chat };

// 初始化本模块
function initModule($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();

    return true;
}

const chat = {
    configModule: configModule,
    initModule: initModule
};