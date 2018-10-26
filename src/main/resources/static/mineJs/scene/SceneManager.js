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
        "esri/Graphic"
    ], (Graphic) => {
        let ship_cache = [];
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
                event: eventName,
                popup: true
            };
            if (!isNaN(lon) && !isNaN(lat)) {
                ship_model = new Graphic({
                    geometry: {
                        type: "point",
                        x: lon,
                        y: lat,
                        z: -7
                    },
                    symbol: {
                        type: "point-3d",
                        symbolLayers: [{
                            type: "object",
                            width: 30,
                            height: 30,
                            depth: 30,
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
        // add all ships
        layer.addMany(ship_cache);
    });
}

/**
 * add stations into our global map
 *
 * @param layer graphic layer
 * @param props essential properties
 * @param stations detail of stations
 */

function init_stations(layer, props, stations) {
    require([
        "esri/Graphic",
        "esri/symbols/IconSymbol3DLayer"
    ], (Graphic) => {
        let station_cache = [];
        stations.forEach((station) => {
            let lon = parseFloat(station.lon), lat = parseFloat(station.lat);
            // let eventName = `${station.name}_event`;
            let station_model = null;
            let handle = {
                id: `${station.name}_id`,
                name: station.name,
                lon: station.lon,
                lat: station.lat,
                switch: true,
                extend: false,
                // event: eventName,
                popup: true,
                // url:"./img/ui/location.png"
            };
            if (!isNaN(lon) && !isNaN(lat)) {
                station_model = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: lon,
                        latitude: lat
                    },
                    symbol: {
                        type:"point-3d",
                        symbolLayers: [{
                            type:"icon",
                            size:20,
                            resource:{
                                href: "./img/ui/location.png"
                            }
                        }]
                    },
                    attributes: handle
                });
                station_cache.push(station_model);
                props.vuePanel.application.popups.push(handle);
            }
        });
        // add all station
        layer.addMany(station_cache);
    });
}

/**
 * This is a manager to manage scenes and init them
 * 1. init map and view (global map)
 * 2. init ships and stations (just add to map)
 * 3. init popup event
 * 4. init scenes (set props and load first scene)
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
                init_stations(layer,props,common.stations);
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
                props.vuePanel.menuEvents.set(scene.eventName, () => scene.themeInit());
                scenes.push(scene);
            } else {
                tools.mutter(`${SceneFactory.name} is not a subclass of Scene`, "error");
            }
        };
        props.scenes.forEach((Factory) => register(Factory));
        scenes[0].themeInit(); // load scene 1
        props.vuePanel.init(); // vue panel init
    };

    const __init_popup_ = (props) => {
        require([
            "esri/geometry/Point"
        ], (Point) => {
            const threshold = 1;
            // bind on drag event
            const firePopup = () => {
                let items = props.staticGLayer.graphics.items.map((x) => x.attributes);
                items = items.filter((x) => x && x.popup);
                items.forEach((item) => {
                    let lon = item.lon, lat = item.lat;
                    let screen_point = props.view.toScreen(new Point({
                        spatialReference: props.view.spatialReference,
                        longitude: lon,
                        latitude: lat
                    }));
                    let map_point = props.view.toMap(screen_point);
                    let dom = $(tools.identify(item.id));
                    dom.css({
                        "left": `${screen_point.x}px`,
                        "top": `${screen_point.y - dom.height()}px`
                    });
                    item.extend = !!(props.view.scale < 1000000);
                    item.switch = !!(map_point && Math.abs(map_point.longitude - lon) <= threshold &&
                        Math.abs(map_point.latitude - lat) <= threshold);
                });
            };
            props.popupEventId = setInterval(() => firePopup(), 100);
            tools.safe_on(props.view, "pointer-move", firePopup);
            tools.safe_on(props.view, "pointer-up", firePopup);
            tools.safe_on(props.view, "pointer-enter", firePopup);
            tools.safe_on(props.view, "resize", firePopup);
        });
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
                    // 3. init popup event
                    __init_popup_(props);
                    // 4. init scenes (set props and load first scene)
                    __init_scenes_(props);
                }, (error)=> {
                    tools.mutter(error, "error");
                });
            });
        } else {
            // only init scenes without global map
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