import {Scene} from "./Scene.js";
import  {AntarcticaScene} from "./AntarcticaScene.js";

export class HighAlttitudePhysicsScene extends Scene {
    constructor(props) {
        super(props);
        super.name = "高空物理场景";
        super.menu = [{
            name: "返回",
            event: AntarcticaScene
        }];

        require(["esri/Camera", "esri/geometry/Point"], (Camera, Point) => {
            super.viewField = new Camera({
                position: new Point({
                    x: 54.58, // lon
                    y: -82.6, // lat
                    z: 18000000, // elevation in meters
                }),
                heading: 0, // facing due south
            });
        });


    }
}


