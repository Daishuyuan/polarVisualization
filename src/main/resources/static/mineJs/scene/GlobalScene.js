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
        this.ROLL_TICK = 100;
        super.name = "全球尺度场景";
        super.menu = [{
            name: "南极区域场景",
            event: AntarcticaScene
        }, {
            name: "北极区域场景",
            event: ArcticScene
        }];
        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            super.viewField = new Camera({
                position: new Point({
                    x: 121.23, // lon
                    y: 30.8, // lat
                    z: 53000000 // elevation in meters
                }),
                heading: 0 // facing due south
            });
        });
    }

    onLoad() {

    }

    onUpdate() {
        this.viewField.position.x += 1;
        this.view.goTo(this.viewField, {
            animate: true
        });
        return this.ROLL_TICK;
    }
}