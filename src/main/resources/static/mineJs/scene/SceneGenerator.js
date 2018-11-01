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
        tools.mutter("begin - 开始初始化考察船", "timer_init_ships");
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
            tools.mutter("end - 考察船初始化完毕", "timer_init_ships");
        });
    },
    /**
     * add stations into our global map
     *
     * @param props essential properties
     */
    init_stations: function (props) {
        tools.mutter("begin - 开始初始化考察站", "timer_init_stations");
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
            tools.mutter("end - 考察站初始化完毕", "timer_init_stations");
        });
    },
    /**
     * scenes initialization
     *
     * @param props essential properties
     */
    init_scenes: function (props) {
        tools.mutter("begin - 开始初始化场景", "timer_init_scenes");
        let scenes = [];
        let register = (SceneFactory) => {
            if (Scene.isPrototypeOf(SceneFactory)) {
                props.wkid = SceneFactory.name;
                let scene = new SceneFactory(props);
                props.vuePanel.menuEvents.set(scene.eventName, () => scene.themeInit());
                scenes.push(scene);
            } else {
                tools.mutter(`${SceneFactory.name} is not a subclass of Scene`, "error");
                return false;
            }
        };
        props.scenes.forEach((Factory) => register(Factory));
        scenes[0].themeInit(); // load scene 1
        props.vuePanel.init(); // vue panel init
        tools.mutter("end - 场景初始化完毕", "timer_init_scenes");
    },
    /**
     * popup initialization
     *
     * @param props essential properties
     */
    init_popup: function (props) {
        tools.mutter("begin - 开始初始化气泡", "timer_init_popup");
        props.popupItems = [];
        require([
            "esri/geometry/Point"
        ], (Point) => {
            const threshold = 1;
            const updateTick = 50;
            let items = props.staticGLayer.graphics.items.map((x) => x.attributes);
            items = items.filter((x) => x && x.popup);
            // bind on drag event
            const firePopup = () => {
                items.forEach((item) => {
                    let lon = item.lon, lat = item.lat, items = props.popupItems;
                    let screen_point = props.view.toScreen(new Point({
                        spatialReference: props.view.spatialReference,
                        longitude: lon,
                        latitude: lat
                    }));
                    let map_point = props.view.toMap(screen_point);
                    let dom = $(tools.identify(item.id));
                    let testList = items.map(x => x.is(":visible")? tools.hitTest(x, dom): false);
                    let hitTest = testList.length > 0? testList.reduce((x,y) => x || y): false;
                    item.extend = !!(props.view.scale < 1000000);
                    item.switch = !!(map_point && Math.abs(map_point.longitude - lon) <= threshold &&
                        Math.abs(map_point.latitude - lat) <= threshold && !hitTest);
                    dom.css({
                        "left": `${screen_point.x}px`,
                        "top": `${screen_point.y - dom.height()}px`
                    });
                });
            };
            tools.dynamicInterval(firePopup, updateTick);
            tools.mutter("end - 气泡初始化完毕", "timer_init_popup");
        });
    },
    /**
     * demonstration initialization
     *
     * @param props essential properties
     */
    init_demonstration: function (props) {
        if (props.demonstrate) {
            const speed = 2500;
            const shift_count = 2;
            let counts = {};
            let basic = 0;
            tools.mutter("begin - 开始初始化演示效果", "timer_init_demonstration");
            tools.dynamicInterval(() => {
                CHARTLIST.forEach(chart => {
                    let option = chart[1],
                        myChart = chart[0],
                        id = option[CHART_UNIQUE],
                        count = counts.hasOwnProperty(id)? counts[id]: counts[id] = 0;
                    switch (id) {
                        case "frequency":
                        case "pointCount":
                            let date_buffer;
                            for (let i = 0; i < shift_count; i++) {
                                date_buffer = option.series[0].data[i];
                                option.series[0].data.shift();
                                option.series[0].data.push(date_buffer);
                            }
                            myChart.setOption(option);
                            break;
                        case "line_datazoom":
                        case "line_geo":
                        case "line_geo_all":
                            let dataBuffer,dateBuffer;
                            for (let i = 0; i < shift_count; i++) {
                                dataBuffer = option.series[0].data[i];
                                dateBuffer = option.xAxis.data[i];
                                option.xAxis.data.shift();
                                option.xAxis.data.push(date_buffer);
                                option.series[0].data.shift();
                                option.series[0].data.push(dataBuffer);
                            }
                            myChart.setOption(option);
                            break;
                        case "wave":
                            let data_buffer;
                            for (let i = 0; i < shift_count; i++) {
                                data_buffer = option.series[0].data[i];
                                option.series[0].data.shift();
                                option.series[0].data.push(data_buffer);
                            }
                            myChart.setOption(option);
                            break;
                        case "heatmap":
                            break;
                        case "complete":
                        case "temperature":
                            let temp = tools.perlinRandom(count += Math.random(), -15, 15);
                            option.series[0].data[0].value = temp.toFixed(2);
                            myChart.setOption(option, true);
                            break;
                        case "pressure":
                            let press = tools.perlinRandom(count += Math.random(), 0, 2);
                            option.series[0].data[0].value = press.toFixed(2);
                            myChart.setOption(option, true);
                            break;
                        case "ringComplete":
                        case "humidity":
                            let hum = tools.perlinRandom(count += Math.random(), 0, 1);
                            option.series[0].data[0] = (hum).toFixed(2);
                            myChart.setOption(option, true);
                            break;
                        case "counter":
                            let num =tools.perlinRandom(count += Math.random(), 0, 1);
                            basic += Math.floor(num * 10);
                            myChart.setOption({
                                title: {
                                    text: (basic).toFixed(0)
                                }
                            });
                            break;
                        case "windRose":
                            let order = parseInt(tools.perlinRandom(count += Math.random(), 0, 15));
                            let level = tools.perlinRandom(count += Math.random(), 8, 13);
                            option.series[0].data.fill(0);
                            option.series[0].data[order] =level;
                            myChart.setOption(option);
                            break;
                        case "roomAlarm":
                        case "fileType":
                            break;
                    }
                    counts[id] = count;
                });
            }, speed);
            tools.mutter("end - 演示效果初始化完毕", "timer_init_demonstration");
        }
    }
};