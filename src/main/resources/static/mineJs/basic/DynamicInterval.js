import { Tools as tools } from "BasicTools.js";

export let DynamicInterval = (func, tick, sign, closeDynamicSchedule) => {
    const MAX_TICK = 100000;
    let _tick = tick,
        _timerId = 0,
        _closeDynamicSchedule = !!closeDynamicSchedule;
    let timer_func = () => {
        clearTimeout(_timerId);
        let start = Date.now();
        if (typeof(func) === "function") {
            func();
        } else {
            tools.mutter("func isn't the type of function.", "error");
            return false;
        }
        _tick = _closeDynamicSchedule? tick: Math.max(1, tick - (Date.now() - start));
        _timerId = setTimeout(timer_func, _tick);
    };
    timer_func();
    return Object.defineProperties({}, {
        halt: {
            writable: false,
            enumerable: false,
            configurable: false,
            value: () => clearTimeout(_timerId)
        },
        start: {
            writable: false,
            enumerable: false,
            configurable: false,
            value: () => timer_func()
        },
        tick: {
            writable: false,
            configurable: false,
            get () {
                return tick;
            },
            set (newTick) {
                tick = Math.min(Math.max(1, newTick | 0), MAX_TICK);
            }
        }
    });
};