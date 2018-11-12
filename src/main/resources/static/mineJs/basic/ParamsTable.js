import { GlobalScene } from "../scene/GlobalScene.js";
import { AntarcticaScene } from "../scene/AntarcticaScene.js";
import { ArcticScene } from "../scene/ArcticScene.js"
import { LidarScene } from "../scene/LidarScene.js"
import { HighAlttitudePhysicsScene } from "../scene/HighAlttitudePhysicsScene.js"

export var PARAMS_TABLE = {
    constants: {
        "MAIN_APP_ID": "PolarApp", // vue application id
        "TABLE_VIEW_ID": "threeJsView", // 3d div id
        "MASK_HTML_PATH": "/cutScene", // cur scene url
        "RECOVER_BTN": "homeTitle", // title button id
        "PRE_DATA_URL": "", // boot url
        "CHART_TEMP_URL":"/api/diagrams",// chart template url
        "SCENE_DATA_URL": "/api/scenes", // link scene data url
        "FILE_DATA_URL":"/api/getTarFilesNames",// file data url
        "DOWNLOAD_IMAGE_URL":"/api/downloadImage", //download images
        "TABLE_DEBUG": false, // table debug model switch
        "ARCGIS_DEBUG": false, // arcgis debug model switch
        "USE_ERROR_LOG": false, // notice error log switch
        "MENU_ID": "menu", // menu id
        "DEMONSTRATE_EVENT": true,// only for demonstration
        "SCENES_LIST": [
            GlobalScene,
            LidarScene,
            AntarcticaScene,
            ArcticScene,
            HighAlttitudePhysicsScene
        ] // current scenes list
    },
    // 特别注意: 事件的key值必须为全大写，value值必须为key值的全小写格式
    events: {
        "SHIP_LOAD_EVENT": "ship_load_event", // ship zoom in invigorating event
        "STATION_LOAD_EVENT": "station_load_event", // station and title change event
        "SHIP_TITLE_CHANGE": "ship_title_change", // ship and title change event
        "VUE_CONTROL": "vue_control" // get full vue handle event
    },
    msgType: {
        "": ""
    }
};