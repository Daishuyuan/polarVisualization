import { TableFactory } from "../diagram/TableFactory.js";
import { Tools as tools } from "../basic/BasicTools.js";
import { PARAMS_TABLE as ptable} from "../basic/ParamsTable.js";
import { Scene } from "./Scene.js";

/**
 * add 3d model of ships into our global map
 *
 * @param layer graphic layer
 * @param props essential properties
 * @param ships detail of ships
 */
function init_ships(layer, props, ships) {
    require([
        "esri/Graphic",
        "esri/geometry/Point"
    ], (Graphic, Point) => {
        let ship_cache = [], threshold = 1;
        ships.forEach((ship) => {
            let lon = parseFloat(ship.lon), lat = parseFloat(ship.lat);
            let eventName = `${ship.name}_event`;
            let ship_model = null;
            let handle = {
                id: `${ship.name}_id`,
                name: ship.name,
                lon: ship.lon,
                lat: ship.lat,
                switch: true,
                extend: false,
                event: eventName
            };
            if (!isNaN(lon) && !isNaN(lat)) {
                ship_model = new Graphic({
                    geometry: {
                        type: "point",
                        x: lon,
                        y: lat,
                        z: 0
                    },
                    symbol: {
                        type: "point-3d",
                        symbolLayers: [{
                            type: "object",
                            width: 30000,
                            height: 30000,
                            depth: 30000,
                            resource: {
                                href: "./models/Ship/warShip.json"
                            }
                        }]
                    },
                    attributes: handle
                });
                ship_cache.push(ship_model);
                props.vuePanel.application.popups.push(handle);
                (function(ship_model) {
                    props.vuePanel.popupEvents.set(eventName, () => {
                        props.view.goTo({
                            target: ship_model,
                            tilt: 60 
                        }).then(() => {
                            tools.getEventByName(ptable.events.SHIP_LOAD_EVENT)(ship_model);
                        });
                    });    
                })(ship_model);
            }
        });
        // bind on drag event
        const firePopup = () => {
            let ships = ship_cache.map((x) => x.attributes);
            ships.forEach((ship) => {
                let lon = ship.lon, lat = ship.lat;
                let screen_point = props.view.toScreen(new Point({
                    spatialReference: props.view.spatialReference,
                    longitude: lon,
                    latitude: lat
                }));
                let map_point = props.view.toMap(screen_point);
                let dom = $(tools.identify(ship.id));
                dom.css({
                    "left": `${screen_point.x}px`,
                    "top": `${screen_point.y - dom.height()}px`
                });
                ship.extend = !!(props.view.scale < 1000000);
                ship.switch = !!(map_point && Math.abs(map_point.longitude - lon) <= threshold &&
                    Math.abs(map_point.latitude - lat) <= threshold);
            });
        };
        setInterval(() => firePopup(), 100);
        tools.safe_on(props.view, "pointer-move", firePopup);
        tools.safe_on(props.view, "pointer-up", firePopup);
        tools.safe_on(props.view, "pointer-enter", firePopup);
        tools.safe_on(props.view, "resize", firePopup);
        // add all ships
        layer.addMany(ship_cache);
    });
}

/**
 * This is a manager to manage scenes and init them
 * 1. init map and view (global map)
 * 2. init ships and stations (just add to map)
 * 3. init scenes (set props and load first scene)
 * @author dsy 2018/9/12
 * @returns {{init: init}} singleton
 * @constructor singleton
 */
export var SceneManager = () => {
    const __init_ship_and_stations_= (layer, props) => {
        $.ajax({
            url: `${props.scenesUrl}/common`,
            dataType: "json"
        }).done((common) => {
            if (common.hasOwnProperty("ships")) {
                init_ships(layer, props, common.ships);
            }
            if (common.hasOwnProperty("stations")) {

            }
            props.map.add(layer);
        });
    };

    const __init_scenes_ = (props) => {
        let scenes = [];
        let register = (SceneFactory) => {
            if (Scene.isPrototypeOf(SceneFactory)) {
                props.wkid = SceneFactory.name;
                let scene = new SceneFactory(props);
                props.vuePanel.menuEvents.set(scene.eventName, () => scene.load());
                scenes.push(scene);
            } else {
                tools.mutter(`${SceneFactory.name} is not a subclass of Scene`, "error");
            }
        };
        props.scenes.forEach((Factory) => register(Factory));
        scenes[0].load(); // load scene 1
        props.vuePanel.init(); // vue panel init
    };

    const __init__ = (props) => {
        tools.watch("props", props);
        props.factory = new TableFactory();
        // arcgis 3d map renderer
        if (!props.table_debug) {
            require([
                "esri/Map",
                "esri/views/SceneView",
                "esri/layers/GraphicsLayer"
            ], (Map, SceneView, GraphicsLayer,) => {
                // 1. init map and view (global map)
                props.map = new Map({
                    logo: false,
                    basemap: "satellite",
                    ground: "world-elevation"
                });
                tools.watch("map", props.map);
                props.view = new SceneView({
                    alphaCompositingEnabled: true,
                    container: props.container,
                    map: props.map,
                    environment: {
                        lighting: {
                            // date: Date.now(),
                            // directShadowsEnabled: false,
                            ambientOcclusionEnabled: true,
                            cameraTrackingEnabled: true
                        },
                        background: {
                            type: "color",
                            color: [0, 0, 0, 0]
                        },
                        starsEnabled: false,
                    }
                });
                tools.watch("view", props.view);
                tools.setEventInApp(ptable.events.VUE_CONTROL, () => props.vuePanel.application);
                props.view.ui.empty('top-left'); // remove control panel in top left
                props.view.ui._removeComponents(["attribution"]); // remove "Powered by esri"
                props.view.when(() => {
                    props.staticGLayer = new GraphicsLayer();
                    // 2. init ships and stations (just add to map)
                    __init_ship_and_stations_(props.staticGLayer, props);
                    // 3. init scenes (set props and load first scene)
                    __init_scenes_(props);
                }, (error)=> {
                    tools.mutter(error, "error");
                });
            });
        } else {
            __init_scenes_(props);
        }
    };

    return {
        init: (props) => {
            if (props) {
                __init__(props);
            } else {
                tools.mutter("props is undefined.", "error");
            }
        }
    }
};