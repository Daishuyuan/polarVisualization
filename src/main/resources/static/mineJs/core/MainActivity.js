/**
 * @name MainActivity 全局配置与应用入口
 * @author dsy 2018-09-10
 * @requires ThreeComponents
 * @requires VueComponents
 * @requires BasicTools
 */
import { VueLayer } from "./VueLayer.js";
import { SceneManager } from "../scene/SceneManager.js";
import { Tools as tools } from "../basic/BasicTools.js";

(function() {
    var MAIN_APP_ID = "PolarApp";
    var TABLEVIEW_ID = "threeJsView";
    var MASK_HTML_PATH = "/cutScene";
    var RECOV_BTN = "homeTitle";
    var PRE_DATA_URL = "http://localhost:3000";
    
    tools.honour();
    try {
        let vueLayer = new VueLayer(MASK_HTML_PATH, MAIN_APP_ID);
        let manager = SceneManager();
        manager.init({
            vuePanel: vueLayer,
            preDataUrl: PRE_DATA_URL,
            container: TABLEVIEW_ID,
            recoverBtn: RECOV_BTN
        });
    } catch (e) {
        tools.mutter(`outermost error msg: ${e}`, "fatal");
    }
})();
