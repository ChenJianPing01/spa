/* chat模块 */

import { util } from './spa.util.js';
export { Chat };

class Chat {

    constructor() {
        this.config = {
            main_html:
                `<div class="spa-chat">
                    <div class="spa-chat-head">
                        <div class="spa-chat-head-toggle">+</div>
                        <div class="spa-chat-head-title">即时通信</div>
                    </div>
                    <div class="spa-chat-closer">X</div>
                    <div class="spa-chat-sizer">
                        <div class="spa-chat-msgs"></div>
                        <div class="spa-chat-box">
                            <input type="text"/>
                            <div>发送</div>
                        </div>
                    </div>
                </div>`,

            settable: {
                slider_open_time: true,
                slider_close_time: true,
                slider_opened_em: true,
                slider_closed_em: true,
                slider_opened_title: true,
                slider_closed_title: true,

                chat_model: true,
                people_model: true,
                shell: true
            },

            slider_open_time: 250,
            slider_close_time: 250,
            slider_opened_em: 32,
            slider_closed_em: 2,
            slider_opened_min_em: 18,
            window_height_min_em: 20,
            slider_opened_title: '点击收起',
            slider_closed_title: '点击展开',

            chat_model: null,
            people_model: null,
            shell: null
        };

        this.state = {
            $append_target: null,
            position_type: 'closed',
            px_per_em: 0,
            slider_hidden_px: 0,
            slider_closed_px: 0,
            slider_opened_px: 0
        };

        this.jqueryBuf = {};
    }

    setJqueryBuf() {
        let $slider = this.state.$append_target.find('.spa-chat');
        this.jqueryBuf = {
            $slider: $slider,
            $head: $slider.find('.spa-chat-head'),
            $toggle: $slider.find('.spa-chat-head-toggle'),
            $title: $slider.find('.spa-chat-head-title'),
            $sizer: $slider.find('.spa-chat-sizer'),
            $msgs: $slider.find('.spa-chat-msgs'),
            $box: $slider.find('.spa-chat-box'),
            $input: $slider.find('.spa-chat-input input[type=text]')
        };
    }

    getEmSize(elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    }

    setPxSizes() {
        let px_per_em = this.getEmSize(this.jqueryBuf.$slider.get(0)),
            window_height_min_em = Math.floor(($(window).height() / px_per_em) + 0.5),
            opened_height_em = window_height_min_em > this.config.window_height_min_em
                                ? this.config.slider_opened_em
                                : this.config.slider_opened_min_em;
        this.state.px_per_em = px_per_em;
        this.state.slider_closed_px = this.config.slider_closed_em * px_per_em;
        this.state.slider_opened_px = opened_height_em * px_per_em;
        this.jqueryBuf.$sizer.css({
            height: (opened_height_em - 2) * px_per_em
        });
    }

    handleResize() {
        if (!this.jqueryBuf.$slider) {return false;}

        this.setPxSizes();
        if (this.state.position_type === 'opened') {
            this.jqueryBuf.$slider.css({height: this.state.slider_opened_px});
        }
        return true;
    }

    setSliderPosition(position_type, callback) {
        let height_px, animate_time, slider_title, toggle_text;
        if (this.state.position_type === position_type) { return true; }
        switch (position_type) {
            case 'opened':
                height_px = this.state.slider_opened_px;
                animate_time = this.config.slider_open_time;
                slider_title = this.config.slider_opened_title;
                toggle_text = '-';
                break;
            case 'hidden':
                height_px = 0;
                animate_time = this.config.slider_open_time;
                slider_title = '';
                toggle_text = '+';
                break;
            case 'closed':
                height_px = this.state.slider_closed_px;
                animate_time = this.config.slider_close_time;
                slider_title = this.config.slider_closed_title;
                toggle_text = '+';
                break;
            default:
                return false;
        }

        // animate slider position change
        this.state.position_type = '';
        this.jqueryBuf.$slider.animate(
            { height: height_px },
            animate_time,
            () => {
                this.jqueryBuf.$toggle.prop('title', slider_title);
                this.jqueryBuf.$toggle.text(toggle_text);
                this.state.position_type = position_type;
                if (callback) { callback(this.jqueryBuf.$slider); }
            }
        );
        return true;
    }

    onClickToggle(event) {
        let shell = this.config.shell;
        if (this.state.position_type === 'opened') {
            shell.setChatAnchor('closed');
        } else if (this.state.position_type === 'closed') {
            shell.setChatAnchor('opened');
        }
        return false;
    }

    removeSlider() {
        if (this.jqueryBuf.$slider) {
            this.jqueryBuf.$slider.remove();
            this.jqueryBuf = {};
        }
        this.state.$append_target = null;
        this.state.position_type = 'closed';

        this.config.chat_model = null;
        this.config.people_model = null;
        this.config.shell = null;

        return true;
    }

    configModule(input) {
        util.setConfig({
            input: input,
            settable: this.config.settable,
            config: this.config
        });
        return true;
    }

    initModule($append_target) {
        $append_target.append(this.config.main_html);
        this.state.$append_target = $append_target;
        this.setJqueryBuf();
        this.setPxSizes();

        this.jqueryBuf.$toggle.prop('title', this.config.slider_closed_title);
        this.jqueryBuf.$head.click(this.onClickToggle.bind(this));
        this.state.position_type = 'closed';

        return true;
    }

}