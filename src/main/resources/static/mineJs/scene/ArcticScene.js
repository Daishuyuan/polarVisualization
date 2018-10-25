import { Scene } from "./Scene.js"
import { GlobalScene } from "./GlobalScene.js"

/**
 * Arctic Scene
 *
 * @author dsy 2018/9/22
 */
export class ArcticScene extends Scene {
    constructor(props) {
        super(props);
        super.name = "北极区域场景";
        super.menu = [{
            name: "返回",
            event: GlobalScene
        }];
        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            super.viewField = new Camera({
                position: new Point({
                    x: 54.58, // lon
                    y: 82.6, // lat
                    z: 18000000, // elevation in meters
                }),
                heading: 95, // facing due south
            });
        });
    }

    onLoad() {

    }
}
        
