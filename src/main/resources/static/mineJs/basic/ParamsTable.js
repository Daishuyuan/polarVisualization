/**
 * used to increase the speed of searching
 *
 * @type {Map<any, any>}
 */
const SEARCH_MAP = new Map();

export var PARAMS_TABLE = {
    constants: {
        "MAIN_APP_ID": "PolarApp",
        "TABLE_VIEW_ID": "threeJsView",
        "MASK_HTML_PATH": "/cutScene",
        "RECOVER_BTN": "homeTitle",
        "PRE_DATA_URL": "",
        "SCENE_DATA_URL": "/api/scenes",
        "TABLE_DEBUG": false,
        "USE_ERROR_LOG": false
    },
    events: {
        "SHIP_LOAD_EVENT": "ship_load_event",
        "STATION_LOAD_EVENT": "station_load_event",
        "SHIP_TITLE_CHANGE": "ship_change",
        "VUE_CONTROL": "vue_control"
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