/* spa.js */

import { shell } from './spa.shell.js';
export { spa };

function initModule($container) {
    shell.initModule($container);
}

var spa = { initModule: initModule };

// 启动模块
$(function () { spa.initModule($('#spa')) });

