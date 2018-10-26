import { GlobalScene } from "../scene/GlobalScene.js";
import { AntarcticaScene } from "../scene/AntarcticaScene.js";
import { ArcticScene } from "../scene/ArcticScene.js"
import { LidarScene } from "../scene/LidarScene.js"

/**
 * used to increase the speed of searching
 *
 * @type {Map<any, any>}
 */
const SEARCH_MAP = new Map();

export var PARAMS_TABLE = {
    constants: {
        "MAIN_APP_ID": "PolarApp", // vue application id
        "TABLE_VIEW_ID": "threeJsView", // 3d div id
        "MASK_HTML_PATH": "/cutScene", // cur scene url
        "RECOVER_BTN": "homeTitle", // title button id
        "PRE_DATA_URL": "", // boot url
        "CHART_TEMP_URL":"/api/diagrams/",// chart template url
        "SCENE_DATA_URL": "/api/scenes", // link scene data url
        "TABLE_DEBUG": false, // table debug model switch
        "USE_ERROR_LOG": false, // notice error log switch
        "MENU_ID": "menu", // menu id
        "DEMONSTRATE_EVENT":true,// only for demonstration
        "SCENES_LIST": [ GlobalScene, LidarScene, AntarcticaScene, ArcticScene] // current scenes list
    },
    events: {
        "SHIP_LOAD_EVENT": "ship_load_event", // ship zoom in invigorating event
        "STATION_LOAD_EVENT": "station_load_event", // station and title change event
        "SHIP_TITLE_CHANGE": "ship_change", // ship and title change event
        "VUE_CONTROL": "vue_control" // get full vue handle event

    },
    exists: (event_id) => {
        if (SEARCH_MAP.size <= 0) {
            for (let name in PARAMS_TABLE.events) {
                if (PARAMS_TABLE.events.hasOwnProperty(name)) {
                    SEARCH_MAP.set(PARAMS_TABLE.events[name], name);
                }
            }
        }
        return SEARCH_MAP.has(event_id);
    }
};