import { Tools as tools } from "../basic/BasicTools.js";
import { DelayTime } from "../core/VueLayer.js";

/**
 * record scene which is initialized by SceneManager
 *
 * @type {Map<any, any>} default empty
 */
const SCENE_NAMES = new Map();
/**
 * record table doms which is initialized by TableFactory
 *
 * @type {Map<any, any>} default empty
 */
const INNER_DOMS = new Map();
/**
 * record well known id of current loaded scene
 *
 * @type {any} default origin
 */
let LAST_SCENE;
/**
 * generate a event name
 *
 * @param Factory subclass of Scene
 * @returns {string} eventName
 */
const GEN_EVENT_NAME = (Factory) => {
    if (Scene.isPrototypeOf(Factory)) {
        return "ZX_EVENT_" + Factory.name;
    }
    return tools.guid();
};

/**
 * super class of all scenes
 * used to control some common operations in other scenes
 * themeInit - this function used to init scene basic params
 *
 * @author dsy 2018/9/22
 */
export class Scene {
    constructor(props) {
        if (!props.wkid) {
            tools.mutter("wkid can't be null or undefined.", "error");
        }
        this.viewField = undefined;
        this.menu = undefined;
        this.name = undefined;
        this.staticGLayer = props.staticGLayer;
        this._vuePanel = props.vuePanel;
        this._tableViewId = props.container;
        this._menuId = props.menuId;
        this._map = props.map;
        this._view = props.view;
        this._factory = props.factory;
        this._wkid = this.__proto__.constructor.name;
        this._scenesUrl = props.scenesUrl;
        this._recoverBtn = props.recoverBtn;
        this._eventName = GEN_EVENT_NAME(this.__proto__.constructor);
        // this._curScene = null;
        // this._preDataUrl = props.preDataUrl;
        // this._staticGLayer = props.staticGLayer;
        SCENE_NAMES.set(this._wkid, this._eventName); // register wkid and eventName
    }

    // this must be override in sub class
    get eventName() {
        return this._eventName;
    }

    // get eventName by name of sub class
    static get names() {
        return SCENE_NAMES;
    }

    // get global map
    get map() {
        return this._map;
    }

    // get view
    get view() {
        return this._view;
    }

    recoverSite() {
        if(this._map && this._view && this.viewField) {
            this._view.goTo(this.viewField, {
                animate: true
            });
        }
    }

    // do the work of themes initialization
    themeInit() {
        const INNER_ON_CLOSE = "onClose";
        const INNER_ON_UPDATE = "onUpdate";
        const INNER_ON_LOAD = "onLoad";
        // set title recover button
        $(tools.identify(this._recoverBtn)).click(() => {
            this.recoverSite();
        });
        // clear before status
        if (LAST_SCENE) {
            // remove current scene update event
            if (LAST_SCENE.hasOwnProperty("onUpdateEventId")) {
                clearTimeout(LAST_SCENE.onUpdateEventId);
                delete LAST_SCENE.onUpdateEventId;
            }
            // hide all tables in last scene
            if(INNER_DOMS.has(LAST_SCENE._wkid)) {
                INNER_DOMS.get(LAST_SCENE._wkid).forEach((dom) => {
                    dom.hide();
                });
            }
            // execute close function in last scene
            if (typeof(LAST_SCENE[INNER_ON_CLOSE]) === "function") {
                LAST_SCENE[INNER_ON_CLOSE]();
            }
        }
        // save handle of current scene
        tools.watch("curSceneHandle", LAST_SCENE = this);
        // execute load function
        if (typeof (this[INNER_ON_LOAD]) === "function") {
            this[INNER_ON_LOAD]();
        }
        // set title name
        if (this.name) {
            this._vuePanel.application.title = this.name;
            tools.watch("curScene", `current scene:${this.name}-${this._wkid}-${this._eventName}`);
        }
        // common process
        if (this.hasOwnProperty("menu")) {
            let delay = new DelayTime(0, 0.1);
            $(this._menuId).children().hide().show(); // reactivate animation in menu elements
            this._vuePanel.application.mbuttons = this.menu.map((x) => {
                return {
                    name: x.name,
                    delay: delay.next(),
                    event:  GEN_EVENT_NAME(x.event)
                }
            });
        }
        // look at defined view field
        this.recoverSite();
        // init tables
        if (INNER_DOMS.has(this._wkid)) {
            INNER_DOMS.get(this._wkid).forEach((dom) => {
                dom.initEvents();
                dom.show();
            });
        } else {
            try {
                let dom_cache = [];
                INNER_DOMS.set(this._wkid, dom_cache);
                tools.req(`${this._scenesUrl}/${this._wkid}`).then((scene) => {
                    if (scene.hasOwnProperty("tableLayer")) {
                        for (let name in scene.tableLayer) {
                            if (scene.tableLayer.hasOwnProperty(name)) {
                                let dom = this._factory.generate(this._tableViewId, scene.tableLayer[name]);
                                dom.id = `${this._wkid}_${name}`;
                                dom_cache.push(dom);
                            }
                        }
                    } else {
                        tools.mutter("tableLayer isn't exist.", "error");
                    }
                });
            } catch (e) {
                tools.mutter(e, "error");
            }
        }
        // execute update in step of render
        if (typeof (this[INNER_ON_UPDATE]) === "function") {
            let tick = 0, inner_func = () => {
                if (tick = this[INNER_ON_UPDATE]()) {
                    this.onUpdateEventId = setTimeout(inner_func, tick);
                }
            };
            this.onUpdateEventId = setTimeout(inner_func, tick);
        }
    }
}