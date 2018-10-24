import { Scene } from "./Scene.js"

/**
 * Lidar Scene
 *
 * @author wxy 2018/9/22
 */
export class LidarScene extends Scene {
    constructor(props) {
        props.wkid = "LidarScene";
        props.eventName = "eventLidarScene";
        super(props);
        require([
            "esri/Graphic",
            "esri/geometry/Point"
        ], (Graphic) => {
            this.model = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.370639,
                    y: -69.373556,
                    z: 13.9
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 50, //5,
                        height: 80, //8,
                        depth: 50, //5,
                        resource: {
                            href: "./models/Lidar/lidar.json"
                        }
                    }]
                }
            });
        });
        props.staticGLayer.add(this.model);
    }

    load() {
        super.themeInit({
            name: "激光雷达场景",
            menu: [{
                name: "返回",
                event: Scene.names.get("AntarcticaScene")
            }],
            viewField: {
                target: this.model,
                tilt: 80
            }
        });
    }
}