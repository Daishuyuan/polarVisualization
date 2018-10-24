/**
 * @name MainActivity Application portal
 * @author dsy 2018-09-10
 */
import { VueLayer } from "./VueLayer.js";
import { SceneManager } from "../scene/SceneManager.js";
import { Tools as tools } from "../basic/BasicTools.js";
import { PARAMS_TABLE as ptable } from "../basic/ParamsTable.js";
import { DataPublisher } from "../basic/DataPublisher.js";

(function() {
    tools.honour();
    try {
        let vueLayer = new VueLayer(ptable.constants.MASK_HTML_PATH, ptable.constants.MAIN_APP_ID);
        let publisher = new DataPublisher({
            use_error_log: ptable.constants.USE_ERROR_LOG
        });
        let manager = SceneManager();
        manager.init({
            vuePanel: vueLayer,
            preDataUrl: ptable.constants.PRE_DATA_URL,
            container: ptable.constants.TABLE_VIEW_ID,
            recoverBtn: ptable.constants.RECOVER_BTN,
            scenesUrl: ptable.constants.SCENE_DATA_URL,
            publisher: publisher,
            table_debug: ptable.constants.TABLE_DEBUG,
            scenes: ptable.constants.SCENES_LIST
        });
    } catch (e) {
        tools.mutter(`outermost error msg: ${e}`, "fatal");
    }
})();
