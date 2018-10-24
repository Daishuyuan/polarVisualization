import {PARAMS_TABLE as ptable} from "./ParamsTable.js";

/**
 * this tools used to demand various functions, this functions always are applied in other modules.
 *
 * @author dsy 2018/10/22
 */
export var Tools = (() => {
    // I want to tell this honour with alacrity here
    const wxy = [
        `<--  Macho Tears  -->`, `!!;:;!;;;'\`:!!|||!||!||`, `\`'::''''%##&!:::::::;!!`,
        `\`\`\`';:'':%@%''::::;:::;`, `::::::;%@&&&&$!::;;:'';`, `:::'''!&&&&&&&%;''''::;`,
        `;;:;!;%@&&&&&&@$!!|;::;`, `|!;;:|&&@&&$$&@&$%&$%||`, `|%!|@@$%&&&$$&@#$;';!:;`,
        `'''|@&||&&&&$&@#@%|!;;!`, `::'|&;:$@&&&$$&&@|::::;`, `:':!%$&###@@#&!:;;::':!`,
        `\`'::::%######$:.\`'';!;;`, `;;:::%##@@###@$%!!|$&$|`, `;;!!;&#&!;%##&|!!!!!!!;`,
        `;!!;;$#$;;|&#&|;;;!|||!`, `::;;!$#%!!;$#&|;:::::;;`,
        `\`''\`'%#|':'!@#$'.\`\`\`\`\`:`, `!::::%@|::''!@&|;;;'';;`
    ];
    const idGenerator = () => {
        let id = 0;

        function* __inner__() {
            while (id += 1) yield id;
        }

        return __inner__();
    };
    const ider = idGenerator();
    const guid = () => {
        let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    const intValue = (num, MAX_VALUE, MIN_VALUE) => Math.max(Math.min(num, MAX_VALUE), MIN_VALUE);
    const _unique = (array) => {
        let temp = {}, r = [], len = array.length, val, type;
        for (let i = 0; i < len; i++) {
            val = array[i];
            type = typeof val;
            if (!temp[val]) {
                temp[val] = [type];
                r.push(val);
            } else if (temp[val].indexOf(type) < 0) {
                temp[val].push(type);
                r.push(val);
            }
        }
        return r;
    };
    const _watch = (name, obj) => {
        if (name in window.watcher) {
            inner_lock = true;
            window.watcher[name] = obj;
        } else {
            (function (inner_value) {
                Object.defineProperty(window.watcher, name, {
                    get() {
                        return inner_value;
                    },
                    set(val) {
                        if (inner_lock) {
                            inner_lock = false;
                            inner_value = val;
                        }
                    }
                });
            })(obj);
        }
    };
    const log_error = console.error;
    const log_warn = console.warn;
    const _mutter = (msg, level) => {
        // to dye our information with different color
        let content = `WXY(id:${ider.next().value},lv:wxy_${level}):%c ${msg}`;
        switch (level) {
            case "fatal":
                console.log(content, "color:#750000");
                break;
            case "error":
                log_error(content, "color:#8600FF");
                break;
            case "warn":
                log_warn(content, "color: #005AB5");
                break;
            case "info":
                console.log(content, "color:#02C874");
                break;
            default:
                console.log(`unknown msg level:${level}`);
                break;
        }
    };
    window.watcher = {};
    let inner_lock = false;
    let FULL_FIELD_EVENT_MAP = new Map();
    let LISTENERS_STATS = [];
    _watch("paramsTable", ptable);
    _watch("listenersNum", LISTENERS_STATS);
    console.error = (str) => _mutter(str, "error");
    console.warn = (str) => _mutter(str, "warn");

    return {
        unique: (array) => {
            return _unique(array);
        },
        // prevent memory leak because of recycle listener definition
        safe_on: (obj, event, func) => {
            let i = 0, len = LISTENERS_STATS.length;
            for (; i < len; ++i) {
                let elem = LISTENERS_STATS[i];
                if (obj === elem.obj && elem.event === event) {
                    _mutter(`common obj and event can't be defined again.`, "warn");
                    break;
                }
            }
            if (i >= len) {
                LISTENERS_STATS.push({
                    src: obj,
                    evt: event,
                    event_id: obj.on(event, func)
                });
                if (LISTENERS_STATS.length > 100) {
                    _mutter(`Listeners could be too huge. please decrease some.`, "warn");
                }
            }
        },
        // set event in full field
        setEventInApp: (name, func) => {
            if (func && typeof(func) === "function") {
                let wkid = name.toUpperCase();
                if (!ptable.events[wkid]) {
                    ptable.events[wkid] = name;
                }
                FULL_FIELD_EVENT_MAP.set(name, func);
            } else {
                _mutter("you must set function to full field function map.", "error");
            }
        },
        getEventByName: (name) => {
            if (FULL_FIELD_EVENT_MAP.has(name)) {
                return FULL_FIELD_EVENT_MAP.get(name);
            } else {
                return () => {
                };
            }
        },
        identify: (id) => {
            return id.startsWith("#") ? id.slice(id.lastIndexOf("#")) : "#" + id;
        },
        hashCode: (strKey, max = 0x7fffffff, min = -0x80000000) => {
            let hash = 0;
            if (!(strKey === undefined || strKey === null || strKey.value === "")) {
                for (var i = 0; i < strKey.length; i++) {
                    hash = hash * 31 + strKey.charCodeAt(i);
                    hash = intValue(hash, max, min);
                }
            }
            return hash;
        },
        watch: (name, obj) => {
            _watch(name, obj);
        },
        sleep: (milliseconds) => {
            let deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve();
            }, milliseconds);
            return deferred;
        },
        req: (url) => {
            return $.ajax({
                url: url,
                type: "GET",
                dataType: "json"
            });
        },
        calRunTime: (callback) => {
            let curTime = Date.now();
            callback();
            return Date.now() - curTime;
        },
        sGuid: () => {
            return 'xxxxxx-xx-4x-yx-xxxxxxxxxx'.replace(/[xy]/g, (c) => {
                let r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        guid: () => {
            return guid();
        },
        honour: () => {
            console.log(`%c ${wxy.join('\n')}`, "color:#008B45;text-shadow:5px 5px 2px #fff," +
            "5px 5px 2px #373E40, 5px 5px 5px #A2B4BA, 5px 5px 10px #82ABBA;font-weight:bolder;");
        },
        mutter: (msg, level) => {
            _mutter(msg, level);
        }
    }
})();