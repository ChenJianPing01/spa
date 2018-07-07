/* spa.util_b模块 */

export { util_b };

class Util_b {

    constructor() {
        this.config = {
            regex_encode_html: /[&"'><]/g,
            regex_encode_noamp: /["'><]/g,
            html_encode: {
                '&': '&#38;',
                '"': '&#34;',
                "'": '&#39;',
                '>': '&#62;',
                '<': '&#60;'
            }
        };

        this.config.encode_noamp = $.extend(
            {}, this.config.html_encode
        );
        delete this.config.encode_noamp['&'];
    }

    decodeHtml(str) {
        return $('<div/>').html(str || '').text();
    }

    encodeHtml(input_arg_str, exclude_amp) {
        let regex, lookup,
            input_str = String(input_arg_str);
        
        if (exclude_amp) {
            lookup = this.config.encode_noamp;
            regex = this.config.regex_encode_noamp;
        } else {
            lookup = this.config.html_encode;
            regex = this.config.regex_encode_html;
        }
        return input_str.replace(regex,
            (match, name) => lookup[match] || ''
        );
    }

    getEmSize(elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    }


}

const util_b = new Util_b();

