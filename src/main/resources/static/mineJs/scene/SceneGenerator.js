import {Tools as tools} from "../basic/BasicTools.js";
import {PARAMS_TABLE as ptable} from "../basic/ParamsTable.js";
import {CHART_UNIQUE, CHARTLIST} from "../diagram/TableFactory.js";
import {Scene} from "./Scene.js";

export let SceneGenerator = {
    /**
     * add 3d model of ships into our global map
     *
     * @param props essential properties
     */
    init_ships: function (props) {
        require([
            "esri/Graphic"
        ], (Graphic) => {
            let ships = props.ships;
            let layer = props.staticGLayer;
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
                    (function (ship_model) {
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
    },
    /**
     * add stations into our global map
     *
     * @param props essential properties
     */
    init_stations: function (props) {
        require([
            "esri/Graphic",
            "esri/symbols/IconSymbol3DLayer"
        ], (Graphic) => {
            let layer = props.staticGLayer;
            let stations = props.stations;
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
                            type: "point-3d",
                            symbolLayers: [{
                                type: "icon",
                                size: 20,
                                resource: {
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
    },
    /**
     * scenes initialization
     *
     * @param props essential properties
     */
    init_scenes: function (props) {
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
    },
    /**
     * popup initialization
     *
     * @param props essential properties
     */
    init_popup: function (props) {
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
    },
    /**
     *
     * @param props
     */
    init_demonstration: function (props) {
        if (props.demonstrate) {
            setInterval(() => {
                CHARTLIST.forEach(chart => {
                    switch (chart[CHART_UNIQUE]) {
                        case "frequency":
                        case "line_datazoom":
                        case "line_geo":
                        case "line_geo_all":
                        case "pointCount":
                        case "wave":
                            break;
                        case "heatmap":
                            break;
                        case "complete":
                        case "gauge":
                        case "ringComplete":
                        case "liquidFill":
                            break;
                        case "counter":
                            break;
                        case "windRose":
                        case "roomAlarm":
                        case "fileType":
                            break;
                    }
                });
            }, 1000);
        }
    }
};