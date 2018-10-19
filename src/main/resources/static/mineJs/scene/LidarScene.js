import { Scene } from "./Scene.js"

export class LidarScene extends Scene {
    constructor(props) {
        props.wkid = "LidarScene";
        props.eventName = "eventLidarScene";
        super(props);
    }

    load() {
        super.themeInit({
            name: "激光雷达场景",
            menu: [{
                name: "返回",
                event: Scene.names.get("AntarcticaScene")
            }]
        });
    }
}