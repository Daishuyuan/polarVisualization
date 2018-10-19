var SEARCH_MAP = new Map();

export var PARAMS_TABLE = {
    events: {
        "SHIP_LOAD_EVENT": "ship_load_event",
        "STATION_LOAD_EVENT": "station_load_event",
        "SHIP_TITLE_CHANGE": "ship_change",
        "VUE_CONTROL": "vue_control"
    },
    exists: (event_id) => {
        if (SEARCH_MAP.size <= 0) {
            for (let name in PARAMS_TABLE.events) {
                SEARCH_MAP.set(PARAMS_TABLE.events[name], name);
            }
        }
        return SEARCH_MAP.has(event_id);
    }
}