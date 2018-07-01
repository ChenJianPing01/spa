/* spa.util.js */

export { util };

// 初始化本模块
function initModule($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();

    return true;
}

const util = {
    configModule: configModule,
    initModule: initModule
};