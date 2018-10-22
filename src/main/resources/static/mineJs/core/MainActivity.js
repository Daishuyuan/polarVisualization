/**
 * @name MainActivity 全局配置与应用入口
 * @author dsy 2018-09-10
 */
import { VueLayer } from "./VueLayer.js";
import { SceneManager } from "../scene/SceneManager.js";
import { Tools as tools } from "../basic/BasicTools.js";
import { PARAMS_TABLE as ptable } from "../basic/ParamsTable.js";

(function() {
    tools.mutter(`sessionId: ${id}`, "info");
    tools.honour();
    try {
        let vueLayer = new VueLayer(ptable.constants.MASK_HTML_PATH, ptable.constants.MAIN_APP_ID);
        let manager = SceneManager();
        manager.init({
            vuePanel: vueLayer,
            preDataUrl: ptable.constants.PRE_DATA_URL,
            container: ptable.constants.TABLEVIEW_ID,
            recoverBtn: ptable.constants.RECOV_BTN
        });
    } catch (e) {
        tools.mutter(`outermost error msg: ${e}`, "fatal");
    }
})();
