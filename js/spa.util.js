/* util模块 */

export { util };

class Util {

    makeError(name, msg, data) {
        let error = new Error();
        error.name = name;
        error.message = msg;
        if (data) { error.data = data; }
        return error;
    }

    setConfig(arg) {
        let input = arg.input,
            settable = arg.settable,
            config = arg.config;
        for (let key in input) {
            if (input.hasOwnProperty(key)) {
                if (settable.hasOwnProperty(key)) {
                    config[key] = input[key];
                } else {
                    throw this.makeError('Bad Input', key + ' is not supported');
                }
            }
        }
    }

}

const util = new Util();