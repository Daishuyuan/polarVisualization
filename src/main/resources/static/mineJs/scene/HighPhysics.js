import {Scene} from "./Scene.js";
import  {AntarcticaScene} from "./AntarcticaScene.js";

export class HighPhysics extends Scene {
    constructor(props) {
        super(props);
        super.name = "高空物理场景";
        super.menu = [{
            name: "返回",
            event: AntarcticaScene
        }];

        require([
            "esri/Graphic",
            "esri/Camera",
            "esri/geometry/Point"
        ], (Graphic, Camera, Point) => {
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
                        width: 5, //5,
                        height: 8, //8,
                        depth: 5, //5,
                        resource: {
                            href: "./models/Lidar/lidar_refine.json"
                        }
                    }]
                }
            });
            this.lidar_position = new Point({
                x: 76.3706,
                y: -69.3735,
                z: 0
            });

            this.camera_position = new Point({
                x: this.lidar_position.x - 0.0011,
                y: this.lidar_position.y,
                z: 31
            });

            super.viewField = new Camera({
                position: this.camera_position,
                heading: 95,
                tilt: 73
            });
        });


    }

    onLoad() {
        if (this.staticGLayer) {
            this.staticGLayer.add(this.model);
        }
    }

    onClose() {
        if (this.staticGLayer) {
            this.staticGLayer.remove(this.model);
        }
    }
}


