/* spa.model.js */

export { model };

// 初始化本模块
function initModule($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();

    return true;
}

const model = {
    configModule: configModule,
    initModule: initModule
};