import { Scene } from "./Scene.js"

/**
 * Arctic Scene
 *
 * @author dsy 2018/9/22
 */
export class ArcticScene extends Scene {
    constructor(props) {
        props.wkid = "ArcticScene";
        super(props);
        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            this.ARCTIC_VIEW_POINT = new Camera({
                position: new Point({
                    x: 54.58, // lon
                    y: 82.6, // lat
                    z: 18000000, // elevation in meters
                }),
                heading: 95, // facing due south
            });
        });
    }

    load() {
        super.themeInit({
            name: "北极区域场景",
            menu: [{
                name: "返回",
                event: Scene.names.get("GlobalScene")
            }],
            viewField: this.ARCTIC_VIEW_POINT
        });
    }
}
        
