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

            this.model = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.36938888888888,
                    y: -69.37300555555555,
                    z: 12
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 2, //5,
                        height: 4, //8,
                        depth: 2, //5,
                        resource: {
                            href: "./models/Lidar/lidar_refine.json"
                        }
                    }]
                }
            });

            this.house01 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37078333333332,
                    y: -69.37256388888888,
                    z: 11.5
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 25, //5,
                        height: 9, //8,
                        depth: 12, //5,
                        resource: {
                            href: "./models/Lidar/house01.json"
                        }
                    }]
                }
            });

            this.house02 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37053055555555,
                    y: -69.37300555555555,
                    z: 11.5
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 30, //5,
                        height: 5, //8,
                        depth: 16, //5,
                        heading: 90,
                        resource: {
                            href: "./models/Lidar/house02.json"
                        }
                    }]
                }
            });

            this.house03 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37004722222221,
                    y: -69.37338333333332,
                    z: 12.5
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 30, //5,
                        height: 9, //8,
                        depth: 15, //5,
                        heading: 180,
                        resource: {
                            href: "./models/Lidar/house03.json"
                        }
                    }]
                }
            });

            this.house04 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37172777777778,
                    y: -69.37361666666666,
                    z: 13.9
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 35, //5,
                        height: 10, //8,
                        depth: 18, //5,
                        heading: 45,
                        resource: {
                            href: "./models/Lidar/house04.json"
                        }
                    }]
                }
            });

            this.house05 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37186388888888,
                    y: -69.37389722222221,
                    z: 17
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 16, //5,
                        height: 4, //8,
                        depth: 8, //5,
                        resource: {
                            href: "./models/Lidar/house05.json"
                        }
                    }]
                }
            });

            this.house06 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37199166666666,
                    y: -69.3742361111111,
                    z: 16
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 20, //5,
                        height: 3, //8,
                        depth: 15, //5,
                        heading: 90,
                        resource: {
                            href: "./models/Lidar/house06.json"
                        }
                    }]
                }
            });

            this.house07 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37300833333333,
                    y: -69.37429999999999,
                    z: 17
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 13, //5,
                        height: 3, //8,
                        depth: 13, //5,
                        resource: {
                            href: "./models/Lidar/house07.json"
                        }
                    }]
                }
            });

            this.house08 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37463888888888,
                    y: -69.37375833333333,
                    z: 8
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 12, //9
                        height: 6, //6,
                        depth: 12,//9
                        heading: 45,
                        resource: {
                            href: "./models/Lidar/house08.json"
                        }
                    }]
                }
            });

            this.house09 = new Graphic({
                geometry: {
                    type: "point",
                    x: 76.37564444444443,
                    y: -69.3740111111111,
                    z: 10.5
                },
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "object",
                        width: 30, //5,
                        height: 6, //8,
                        depth: 9, //5,
                        heading: 45,
                        resource: {
                            href: "./models/Lidar/house_09_dae.json"
                        }
                    }]
                }
            });

            this.camera_position = new Point({
                x: this.model.geometry.x - 0.0011,
                y: this.model.geometry.y,
                z: 31
            });

            super.viewField = new Camera({
                position: this.camera_position,
                heading: 85,
                tilt: 73
            });
        });


    }

    onLoad() {
        if (this.staticGLayer) {
            this.staticGLayer.add(this.model);
            this.staticGLayer.add(this.house01);
            this.staticGLayer.add(this.house02);
            this.staticGLayer.add(this.house03);
            this.staticGLayer.add(this.house04);
            this.staticGLayer.add(this.house05);
            this.staticGLayer.add(this.house06);
            this.staticGLayer.add(this.house07);
            this.staticGLayer.add(this.house08);
            this.staticGLayer.add(this.house09);

        }
    }

    onClose() {
        if (this.staticGLayer) {
            this.staticGLayer.remove(this.model);
            this.staticGLayer.remove(this.house01);
            this.staticGLayer.remove(this.house02);
            this.staticGLayer.remove(this.house03);
            this.staticGLayer.remove(this.house04);
            this.staticGLayer.remove(this.house05);
            this.staticGLayer.remove(this.house06);
            this.staticGLayer.remove(this.house07);
            this.staticGLayer.remove(this.house08);
            this.staticGLayer.remove(this.house09);
        }
    }
}