import { OPTIONS } from './config.js';

const terminal = (msg) => {
    if (OPTIONS.DEBUG_MODE && msg != "") {
        console.log(msg);
    }
};

export default terminal;