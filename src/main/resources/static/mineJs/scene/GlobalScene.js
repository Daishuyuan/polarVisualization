import { Scene } from "./Scene.js"
import { AntarcticaScene } from "./AntarcticaScene.js"
import { ArcticScene } from "./ArcticScene.js"

/**
 * Global Scene
 *
 * @author dsy 2018/9/22
 */
export class GlobalScene extends Scene {
    constructor(props) {
        super(props);
        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            this.GLOBAL_VIEW_POINT = new Camera({
                position: new Point({
                    x: 121.23, // lon
                    y: 30.8, // lat
                    z: 53000000 // elevation in meters
                }),
                heading: 0 // facing due south
            });
        });
    }

    load() {
        super.themeInit({
            name: "全球尺度场景",
            menu: [{
                name: "南极区域场景",
                event: Scene.names.get(AntarcticaScene.name)
            }, {
                name: "北极区域场景",
                event: Scene.names.get(ArcticScene.name)
            }],
            viewField: this.GLOBAL_VIEW_POINT
        });
    }
}