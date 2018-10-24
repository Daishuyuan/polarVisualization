import { Tools as tools } from "../basic/BasicTools.js";
import { DelayTime } from "../core/VueLayer.js";

const SCENE_NAMES = new Map();
const INNER_DOMS = new Map();
let CUR_SCENE = null;

export class Scene {
    constructor(props) {
        if (!props.wkid || !props.eventName) {
            tools.mutter("wkid and eventName both can't be null or undefined.", "error");
        }
        this._vuePanel = props.vuePanel;
        this._tableViewId = props.container;
        this._menuId = props.menuId;
        this._staticGLayer = props.staticGLayer;
        this._map = props.map;
        this._view = props.view;
        this._factory = props.factory;
        this._wkid = props.wkid;
        this._eventName = props.eventName;
        this._preDataUrl = props.preDataUrl;
        this._scenesUrl = props.scenesUrl;
        this._recoverBtn = props.recoverBtn;
        this._curScene = null;
        this._curProps = null;
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