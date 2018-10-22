import { Tools as tools } from "../basic/BasicTools.js"

export class VueLayer {
    constructor(MASK_HTML_PATH, MAIN_APP_ID) {
        // generate menu events
        const menuButtonEvents = new Map(),
            popupButtonEvents = new Map();

        // initialize the application
        this.mainApp = new Vue({
            el: tools.identify(MAIN_APP_ID),
            data: {
                fakePage: MASK_HTML_PATH,
                loaded: false,
                title: "",
                mbuttons: [],
                popups: []
            },
            methods: {
                mbtnEvent: function (event) {
                    if (menuButtonEvents.has(event)) {
                        menuButtonEvents.get(event)();
                    } else {
                        layer.msg('暂未实现，敬请期待', {
                            offset: 't',
                            anim: 6
                        });
                        tools.mutter(`uninitialized menu event: ${event}`, "warn");
                    }
                },
                pop: function(event) {
                    if (popupButtonEvents.has(event)) {
                        popupButtonEvents.get(event)();
                    } else {
                        tools.mutter(`uninitialized popup event: ${event}`, "warn");
                    }
                }
            }
        });

        // private variables
        this.menuButtonEvents = menuButtonEvents;
        this.popupButtonEvents = popupButtonEvents;
    }

    get menuEvents() {
        return this.menuButtonEvents;
    }

    get popupEvents() {
        return this.popupButtonEvents;
    }

    get application() {
        return this.mainApp;
    }

    init() {
        this.mainApp.loaded = true;
    }
}

export class DelayTime {
    constructor(count, step) {
        this.step = step;
        this.count = count;
    }

    next() {
        this.count += this.step;
        return `animation-delay: ${this.count}s;-webkit-animation-delay: ${this.count}s;`;
    }
}