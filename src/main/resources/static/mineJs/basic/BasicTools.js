import {PARAMS_TABLE as ptable} from "./ParamsTable.js";

/**
 * this tools used to demand various functions, this functions always are applied in other modules.
 *
 * @author dsy 2018/10/22
 */
export let Tools = (() => {
    // I want to tell this honour with alacrity here( Our Talisman )
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
    const generator = idGenerator();
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
    const _transformXY = (jqDom, model) => {
        switch (model) {
            case "transform":
                let sign = jqDom.is(":visible");
                if (!sign) jqDom.toggle();
                let transform = jqDom.css("transform");
                let matrix = transform.replace('matrix(', '[').replace(')', ']');
                matrix = JSON.parse(matrix);
                if(!sign) jqDom.toggle();
                return [matrix[4], matrix[5]];
            case "absolute":
                return [parseFloat(jqDom.css("left")), parseFloat(jqDom.css("top"))];
            default:
                _mutter(`not find this model: ${model}`, "error");
        }
    };
    const _mutter = (msg, level) => {
        // to dye our information with different color
        let content = `WXY(id:${generator.next().value},lv:wxy_${level}):%c ${msg}`;
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
    const noise = (n) => {
        n = (n >> 0xd) ^ n;
        let nn = (n * (n * n * 0xec4d + 0x131071f) + 0x5208dd0d) & 0x7fffffff;
        return 1.0 - (nn / 0x40000000);
    };
    const countDoms = (node) => {
        //  计算自身
        let count = 1;
        //  判断是否存在子节点
        if (node.hasChildNodes()) {
            //  获取子节点
            let children = node.childNodes;
            //  对子节点进行递归统计
            for (let i = 0; i < children.length; i++) {
                let jqDom = $(children[i]);
                if (jqDom.is(":visible")) {
                    count = count + countDoms(children[i]);
                }
            }
        }
        return count;
    };
    window.watcher = {};
    let inner_lock = false;
    let FULL_FIELD_EVENT_MAP = new Map();
    let LISTENERS_STATS = [];
    _watch("paramsTable", ptable);
    _watch("listenersNum", LISTENERS_STATS);

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
                for (let i = 0; i < strKey.length; ++i) {
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
        },
        dynamicInterval: (func, tick) => {
            let _tick = tick,
                timerId = 0,
                halt = false;
            let timer_func = () => {
                let start = Date.now();
                if (typeof(func) === "function") {
                    func();
                } else {
                    _mutter("func isn't the type of function.", "error");
                    return false;
                }
                _tick = Math.max(1, tick - (Date.now() - start));
                if(!halt) {
                    timerId = setTimeout(timer_func, _tick);
                }
            };
            timer_func();
            return {
                getTimerId: () => timerId,
                halt: () => halt = false,
                start: () => timer_func(halt = true)
            };
        },
        hitTest: (a, a_model, b, b_model) => {
            let [leftOne, topOne] = _transformXY(a, a_model),
                [leftTwo, topTwo] = _transformXY(b, b_model),
                widthOne = a.width(),
                widthTwo = b.width(),
                heightOne = a.height(),
                heightTwo = b.height();
            let leftTop = leftTwo > leftOne && leftTwo < leftOne + widthOne
                && topTwo > topOne && topTwo < topOne + heightOne,
                rightTop = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne
                    && topTwo > topOne && topTwo < topOne + heightOne,
                leftBottom = leftTwo > leftOne && leftTwo < leftOne + widthOne
                    && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne,
                rightBottom = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne
                    && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne;
            return leftTop || rightTop || leftBottom || rightBottom;
        },
        perlinRandom: (x, min, max) => {
            let a = Math.abs(max - min) / 4;
            let intX = parseInt(x);
            let n0 = noise(intX);
            let n1 = noise(intX + 1);
            let weight = x - Math.floor(x);
            return a * (Math.sin(n0 * (1 - weight)) + Math.cos(n1 * weight) + 2) + min;
        },
        countDomNum: function (node) {
            return countDoms(node);
        }
    }
})();