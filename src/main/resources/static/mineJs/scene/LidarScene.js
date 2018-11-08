import { Scene } from "./Scene.js"
import { AntarcticaScene } from "./AntarcticaScene.js"

/**
 * Lidar Scene
 *
 * @author wxy 2018/9/22
 */
export class LidarScene extends Scene {
    constructor(props) {
        super(props);
        super.name = "激光雷达场景";
        super.menu = [{
            name: "返回",
            event: AntarcticaScene
        }];
        require([
            "esri/Graphic",
            "esri/Camera",
            "esri/geometry/Point"
        ], (Graphic, Camera, Point) => {
            this.lidarObjectsArr = [];
            for (let obj of props.lidarObjects) {
                let object = new Graphic({
                    geometry: {
                        type: "point",
                        x: obj.position.x,
                        y: obj.position.y,
                        z: obj.position.z
                    },
                    symbol: {
                        type: "point-3d",
                        symbolLayers: [{
                            type: "object",
                            width: obj.shape.width,
                            height: obj.shape.height,
                            depth: obj.shape.depth,
                            heading: obj.shape.heading,
                            resource: {href: obj.href}
                        }]
                    }
                });
                this.lidarObjectsArr.push(object);
            }

            let cameraPos = {
                x: props.lidarObjects[0].position.x - 0.0011,
                y: props.lidarObjects[0].position.y,
                z: 31
            };
            super.viewField = new Camera({
                position: cameraPos,
                heading: 85,
                tilt: 73
            });
        })
    }

    onLoad() {
        if (this.staticGLayer) {
            this.staticGLayer.addMany(this.lidarObjectsArr);
        }
    }

    onClose() {
        if (this.staticGLayer) {
            this.staticGLayer.removeMany(this.lidarObjectsArr);
        }
    }
}