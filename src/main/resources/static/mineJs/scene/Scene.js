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
 * @type {null} default origin
 */
let CUR_SCENE = null;

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
        const PREFIX_WKID = "ZX_EVENT_";
        this._vuePanel = props.vuePanel;
        this._tableViewId = props.container;
        this._menuId = props.menuId;
        this._map = props.map;
        this._view = props.view;
        this._factory = props.factory;
        this._wkid = props.wkid;
        this._scenesUrl = props.scenesUrl;
        this._recoverBtn = props.recoverBtn;
        this._curProps = null;
        this._eventName = PREFIX_WKID + props.wkid;
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

    recoverSite() {
        let props = this._curProps;
        if(props && this._map && this._view && props.viewField) {
            this._view.goTo(props.viewField, {
                animate: true
            });
        }
    }

    // do the work of themes initialization
    themeInit(props) {
        // set title recover button
        $(tools.identify(this._recoverBtn)).click(() => {
            this.recoverSite();
        });
        // clear before status
        if(CUR_SCENE && INNER_DOMS.has(CUR_SCENE)) {
            INNER_DOMS.get(CUR_SCENE).forEach((dom) => {
                dom.hide();
            });
        }
        this._curProps = props;
        CUR_SCENE = this._wkid;
        if (props.name) {
            this._vuePanel.application.title = props.name;
            tools.watch("curScene", `current scene:${props.name}-${this._wkid}-${this._eventName}`);
        }
        // common process
        let delay = new DelayTime(0, 0.1);
        $(this._menuId).children().hide().show(); // reactivate animation in menu elements
        this._vuePanel.application.mbuttons = props.menu.map((x) => {
            return {
                name: x.name,
                delay: delay.next(),
                event: x.event
            }
        });
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
                INNER_DOMS.set(this._wkid, dom_cache);
            } catch (e) {
                tools.mutter(e, "error");
            }
        }
    }
}