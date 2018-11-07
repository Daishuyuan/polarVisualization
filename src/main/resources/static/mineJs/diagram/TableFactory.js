/**
 * @name TableFactory 图表配置工厂
 * @author dsy zxj 2018-10-08
 * @description 在给定的Div中依据配置信息生成并加载对应的图表,配置信息格式如下：
 * oneTablePane {} -> pane {} -> 浮动面板的css配置
 * -----------------> rows [] -> row {} -> description 行描述信息
 * --------------------------------------> height 行高度 >= 0
 * --------------------------------------> class css样式类名
 * --------------------------------------> cols [] -> col {} -> type 类型 = title/chart/capsule/panel
 * -----------------------------------------------------------> name(title/chart) 标题名称
 * -----------------------------------------------------------> title_class(chart) 标题的css类名
 * -----------------------------------------------------------> title_height(chart) 标题高度
 * -----------------------------------------------------------> style(title/chart) 主体的css类名
 * -----------------------------------------------------------> height(title/chart/panel) 列高度 >= 0
 * -----------------------------------------------------------> description(all) 列描述信息
 * -----------------------------------------------------------> column(all) 列样式，如col-md-?
 * -----------------------------------------------------------> url(chart) 图表加载的数据源地址
 * -----------------------------------------------------------> src(chart/panel) 加载的数据源的名称
 * -----------------------------------------------------------> rows(capsule) capsule中的行元素
 * -----------------------------------------------------------> data_url(chart) 数据url拉取地址
 * -----------------------------------------------------------> data_proc(chart) 拉取到数据后的处理函数Str类型
 * -----------------------------------------------------------> prefix(title) 标题装饰性前缀
 * -----------------------------------------------------------> event_id(title) 绑定变更函数名称
 **/
import {Tools as tools} from "../basic/BasicTools.js"
import {PARAMS_TABLE as ptable} from "../basic/ParamsTable.js"
import {TYPE_ECHARTS} from "../basic/DataPublisher.js"
import {ImagePlayer} from "./ImagePlayer.js"

export let CHARTLIST = [];
export const CHART_UNIQUE = "DSY_CHART_UNIQUE";// chart unique sign

export class TableFactory {
    constructor() {
        const NO_MARGIN = "margin: 0px"; // no margin style
        const ROW_MARGIN_STYLE = "margin-right: -0.79vw;"; // row margin style
        const TITLE_DEFAULT_HEIGHT = 10; // default title height
        const guid = tools.sGuid; // guid generator
        const sstd = (x) => !!x ? x : ""; // string standard
        const nstd = (x) => !isNaN(parseFloat(x)) && x > 0 ? x : 0; // number standard
        const TITLE_SIGN = "title";
        const CHART_SIGN = "chart";
        const CAPSULE_SIGN = "capsule";
        const PANEL_SIGN = "panel";
        const PLAYER_SIGN = "player";

        // load event and update handle event
        function loadEvent(node) {
            switch (node.type) {
                case TITLE_SIGN:
                    let jqId = node.domId, content = $(jqId).html();
                    delete node.name;
                    Object.defineProperty(node, "name", {
                        configurable: true,
                        get() {
                            return content;
                        },
                        set(name)
                        {
                            $(jqId).html(content = name);
                        }
                    });
                    tools.setEventInApp(node.event_id, () => node);
                    break;
                case CHART_SIGN:
                    if (node.url) {
                        let entity = {
                            type: TYPE_ECHARTS,
                            url: node.url,
                            target: node.chart
                        };
                        tools.setEventInApp(node.event_id, () => entity);
                    }
                    break;
            }
        }

        // load chart
        function loadChart(node) {
            let dom = node.dom;
            let myChart = echarts.init(dom[0], 'macarons');
            $.ajax({
                url: `${ptable.constants.CHART_TEMP_URL}/${node.url}`,
                type: "GET",
                dataType: "json",
                success: function (option) {
                    option[CHART_UNIQUE]=node.url;
                    CHARTLIST.push([myChart,option]);
                    myChart.setOption(option);
                    myChart.resize();
                }
            });
            return myChart;
        }

        //load player
        function loadPlayer(node){
            const imageLoader = (player) =>{
                let path = `${ptable.constants.FILE_DATA_URL}/${node.type}`;
                $.ajax({
                    url: path,
                    type:"GET",
                    dataType:"json",
                    success: function (names) {
                        names.forEach(name =>{
                            player.addImage(`${ptable.constants.DOWNLOAD_IMAGE_URL}/${node.type}/${name}`);
                        });
                    },
                    error:function () {
                        tools.mutter(`Can not find the file ${path}.`, "error");
                    }
                });
            };
            if (node.hasOwnProperty("type")){
                let path =`${ptable.constants.CHART_TEMP_URL}/${node.url}`;
                $.ajax({
                    url:path,
                    type: "GET",
                    dataType: "json",
                    success: function (option) {
                        option.width = node.dom.width();
                        option.height = node.dom.height();
                        imageLoader(new ImagePlayer(node.dom, option));
                    }
                });
            }else{
                tools.mutter(`Can not find the file ${path}.`, "error");
            }
        }

        // diagram initialization
        this.__init__ = (jqDom, config) => {
            jqDom.ready(function () {
                const tbcnt = [],
                    echDelay = [],
                    events = [],
                    players = [];

                // cols processing
                function __col_owner__(i, row, cols) {
                    for (let j = 0; j < cols.length; j++) {
                        let errors = [];
                        if (cols[j]) {
                                let node = cols[j];
                                tbcnt.push(`<div class='${sstd(node.column)}' style='height:100%;padding-left:1%;padding-right:0;'>`);
                                switch (node.type) {
                                    case PANEL_SIGN:
                                        if (node.hasOwnProperty("src")) {
                                            let height = node.height? node.height: 100;
                                            let panel = `<div class="${node.src}" style="height:${height}%;"></div>`;
                                            tbcnt.push(panel);
                                        } else {
                                            errors.push("type of panel don't define source of css.");
                                        }
                                        break;
                                    case TITLE_SIGN:
                                        let prefix_content = "",
                                            title_content = "",
                                            control = "",
                                            content = sstd(node.name),
                                            id = `TITLE${tools.guid().replace(/-/g, "")}`;
                                        if (node.prefix) {
                                            prefix_content = `<p class='${node.prefix}'></p>`;
                                            control = "style='display: inline-flex;'";
                                        }
                                        title_content = `<p id='${id}' style='${NO_MARGIN}' class='${sstd(node.style)}'>${content}</p>`;
                                        tbcnt.push(`<div ${control}>${prefix_content}${title_content}</div>`);
                                        if (ptable.exists(node.event_id)) {
                                            events.push({
                                                domId: tools.identify(id),
                                                event_id: node.event_id,
                                                type: node.type
                                            });
                                        }
                                        break;
                                    case CHART_SIGN:
                                        let _id = `ZXJ${guid()}`.replace(/-/g, ""),
                                            title_height = 0;
                                        // if node exist name then init title above this chart
                                        if (node.name) {
                                            let content_title = `<p style='margin:0;'>${sstd(node.name)}</p>`;
                                            title_height = node.hasOwnProperty("title_height") ? node.title_height : TITLE_DEFAULT_HEIGHT;
                                            title_height = Math.min(Math.max(0, title_height), 100);
                                            if (node.hasOwnProperty("title_class")) {
                                                tbcnt.push(`<div class='${sstd(node.title_class)}' style="height: ${title_height}%;text-align: center;margin:0;">${content_title}</div>`);
                                            }
                                        }
                                        tbcnt.push(`<div id='${_id}' style='height:${100 - title_height}%;' class='${sstd(node.style)}'></div>`);
                                        echDelay.push({
                                            event_id: node.event_id,
                                            id: _id,
                                            url: node.url,
                                            data_url:node.data_url
                                        });
                                        break;
                                    case PLAYER_SIGN:
                                        let pid = `DSY${guid()}`.replace(/-/g, ""),
                                            name_height = 0;
                                        // if node exist name then init title above this player
                                        if (node.name) {
                                            let content_title = `<p style='margin:0;'>${sstd(node.name)}</p>`;
                                            name_height = node.hasOwnProperty("title_height") ? node.title_height : TITLE_DEFAULT_HEIGHT;
                                            name_height = Math.min(Math.max(0, name_height), 100);
                                            if (node.hasOwnProperty("title_class")) {
                                                tbcnt.push(`<div class='${sstd(node.title_class)}' style="height: ${name_height}%;text-align: center;margin:0;">${content_title}</div>`);
                                            }
                                        }
                                        tbcnt.push(`<div id='${pid}' style='height:${100 - name_height}%; ${sstd(node.style)}'></div>`);
                                        if(node.hasOwnProperty("category")){
                                            players.push({
                                                id: pid,
                                                type:node.category,
                                                url: node.url
                                            });
                                        }else{
                                            errors.push("Can not find the path.")
                                        }

                                        break;
                                    case CAPSULE_SIGN:
                                        __row_owner__(node.rows);
                                        break;
                                    default:
                                        errors.push(`unknown type:${node.type ? node.type : "null"}`);
                                        break;
                                }
                                tbcnt.push("</div>");
                            } else {
                            errors.push("cols elements can't be empty.");
                        }
                        errors.forEach((e) => {
                            let vrow = row.description ? row.description : i + 1,
                                vcol = node.description ? node.description : j + 1;
                            tools.mutter(`${vrow}-${vcol} => ${e}`, "error");
                        });
                    }
                }

                // rows processing
                function __row_owner__(rows) {
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i]) {
                            let row = rows[i];
                            let row_style = `height:${nstd(row.height)}%;${ROW_MARGIN_STYLE};`;
                            tbcnt.push(`<div class='row ${sstd(row.class)}' style='${row_style}'>`);
                            __col_owner__(i, row, row.cols);
                            tbcnt.push("</div>");
                        } else {
                            let description = row.hasOwnProperty("description") ? row.description : i + 1;
                            tools.mutter(`row error: ${description}`, "error");
                        }
                    }
                }

                // Entry of lathe
                !function () {
                    if (config) {
                        // config initialization cave-in
                        if (config.hasOwnProperty("pane")) {
                            for (let name in config.pane) {
                                if (config.pane.hasOwnProperty(name)) {
                                    switch (name) {
                                        case "class":
                                            config.pane[name].forEach(css => jqDom.addClass(css));
                                            break;
                                        default:
                                            jqDom.css(name, config.pane[name]);
                                    }
                                }
                            }
                        } else {
                            tools.mutter("pane not in config.", "error");
                        }
                        tbcnt.push(`<div class='container-fluid' style='height:100%;'>`);
                        if (config.rows) {
                            __row_owner__(config.rows);
                        } else {
                            tools.mutter("rows not in config.", "error");
                        }
                        tbcnt.push("</div>");
                        // echarts initialization
                        jqDom.append(tbcnt.join('\n'));
                        for (let i = 0; i < echDelay.length; ++i) {
                            let node = echDelay[i];
                            node.dom = jqDom.find(tools.identify(node.id));
                            let chart = loadChart(node);
                            if (node.event_id) {
                                events.push({
                                    chart: chart,
                                    event_id: node.event_id,
                                    url: node.data_url,
                                    type: node.type
                                });
                            }
                        }
                        players.forEach(node =>{
                            node.dom = jqDom.find(tools.identify(node.id));
                            loadPlayer(node);
                        });

                        // initialize events (These events are used soon after)
                        jqDom.initEvents = () => {
                            for (let i = 0, len = events.length; i < len; ++i) {
                                loadEvent(events[i]);
                            }
                        };
                        jqDom.initEvents();
                    }
                }();
            });
            return jqDom;
        }
    }

    // tables generation by configuration and identification
    generate(id, config) {
        let dom = document.createElement("div"),
            handle = this.__init__($(dom), config);
        $(tools.identify(id)).append(dom);
        return handle;
    }
}