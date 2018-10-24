import { Scene } from "./Scene.js"
import { Tools as tools} from "../basic/BasicTools.js"
import { PARAMS_TABLE as ptable } from "../basic/ParamsTable.js"
import { GlobalScene } from "./GlobalScene.js"
import { LidarScene } from "./LidarScene.js"

/**
 * Antarctica Scene
 *
 * @author dsy 2018/9/22
 */
export class AntarcticaScene extends Scene {
    constructor(props) {
        super(props);
        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            this.ANTARCTICA_VIEW_POINT = new Camera({
                position: new Point({
                    x: 54.58, // lon
                    y: -82.6, // lat
                    z: 18000000, // elevation in meters
                }),
                heading: 0, // facing due south
            });
        });
    }

    load() {
        super.themeInit({
            name: "南极区域场景",
            menu: [{
                name: "返回",
                event: Scene.names.get(GlobalScene.name)
            }, {
                name: "激光雷达",
                event: Scene.names.get(LidarScene.name)
            }, {
                name: "冰下湖钻探",
                event: "eventIceLakeDrillingScene"
            }, {
                name: "高空物理",
                event: "eventHighAltitudePhysicsScene"
            }],
            viewField: this.ANTARCTICA_VIEW_POINT
        });
        tools.setEventInApp(ptable.events.SHIP_LOAD_EVENT, (ship) => {
            ship.attributes.extend = true;
            let title_entity = tools.getEventByName(ptable.events.SHIP_TITLE_CHANGE)();
            if (title_entity) {
                title_entity.name = ship.attributes.name + "实时气象信息";
            }
        });
    }
}