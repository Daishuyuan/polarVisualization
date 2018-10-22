/**
 * @name TableFactory 图表配置工厂
 * @author dsy 2018-10-08
 * @description 在给定的Div中依据配置信息生成并加载对应的图表,配置信息格式如下：
 * oneTablePane {} -> pane {} -> 浮动面板的css配置
 * -----------------> rows [] -> row {} -> descrip 行描述信息
 * --------------------------------------> height 行高度 >= 0
 * --------------------------------------> class css样式类名
 * --------------------------------------> cols [] -> col {} -> type 类型 = title/chart/capsule
 * -----------------------------------------------------------> name(title/chart) 标题名称
 * -----------------------------------------------------------> title_class(chart) 标题的css类名
 * -----------------------------------------------------------> title_height(chart) 标题高度
 * -----------------------------------------------------------> style(title/chart) 主体的css类名
 * -----------------------------------------------------------> height(title/chart) 列高度 >= 0
 * -----------------------------------------------------------> descrip(all) 列描述信息
 * -----------------------------------------------------------> column(all) 列样式，如col-md-?
 * -----------------------------------------------------------> url(chart) 图表加载的数据源地址
 * -----------------------------------------------------------> src(chart) 加载的数据源的名称
 * -----------------------------------------------------------> rows(capsule) capsule中的行元素
 * -----------------------------------------------------------> data_url(chart) 数据url拉取地址
 * -----------------------------------------------------------> data_proc(chart) 拉取到数据后的处理函数Str类型
 * -----------------------------------------------------------> prefix(title) 标题装饰性前缀
 * -----------------------------------------------------------> event_id(title) 绑定变更函数名称
 **/
import {Tools as tools} from "../basic/BasicTools.js"
import {PARAMS_TABLE as ptable} from "../basic/ParamsTable.js"
import {TYPE_ECHARTS} from "../basic/DataPublisher.js"

export class TableFactory {
    constructor() {
        const NO_MARGIN = "margin: 0px"; // no margin style
        const ROW_MARGIN_STYLE = "margin-right: -0.79vw;margin-left: -0.79vw;"; // row margin style
        const TITLE_DEFAULT_HEIGHT = 10; // default title height
        const guid = tools.sGuid; // guid generator
        const sstd = (x) => !!x ? x : ""; // string standard
        const nstd = (x) => !isNaN(parseFloat(x)) && x > 0 ? x : 0; // number standard

        // load event
        function loadEvent(node) {
            switch (node.type) {
                case "title":
                    let jqId = node.domId, content = $(jqId).html();
                    Object.defineProperty(node, "name", {
                        get() {
                            return content;
                        },
                        set(name) {
                            $(jqId).html(content = name);
                        }
                    });
                    tools.setEventInApp(node.event_id, () => node);
                    break;
                case "chart":
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
            let myChart = echarts.init(dom[0]);
            $.ajax({
                url: node.url,
                type: "GET",
                dataType: "json",
                success: function (option) {
                    myChart.setOption(option);
                    myChart.resize();
                    if (option.series[0].type === "gauge") {
                        setInterval(function () {
                            option.series[0].data[0].value = (Math.random() * 100 + 1).toFixed(1) - 0;
                            myChart.setOption(option, true);
                        }, 4000);
                    }
                }
            });
            return myChart;
        }

        this.__init__ = (jqDom, config) => {
            jqDom.ready(function () {
                const tbcnt = [],
                    echDelay = [],
                    events = [];

                // cols processing
                function __col_owner__(i, row, cols) {
                    for (let j = 0; j < cols.length; j++) {
                        if (cols[j]) {
                            let node = cols[j];
                            tbcnt.push(`<div class='${sstd(node.column)}' style='height:100%;padding-left:1%;padding-right:0;'>`);
                            switch (node.type) {
                                case "title":
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
                                case "chart":
                                    let _id = `ZXJ${guid()}`.replace(/-/g, ""),
                                        title_height = 0;
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
                                        data_url: node.data_url
                                    });
                                    break;
                                case "capsule":
                                    __row_owner__(node.rows);
                                    break;
                                default:
                                    tools.mutter(`unknown type:${node.type ? node.type : "null"}`, "error");
                                    break;
                            }
                            tbcnt.push("</div>");
                        } else {
                            let vrow = row.descrip ? row.descrip : i + 1,
                                vcol = node.descrip ? node.descrip : j + 1;
                            tools.mutter(`column error: ${vrow}-${vcol}`, "error");
                        }
                    }
                }

                // rows processing
                function __row_owner__(rows) {
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i]) {
                            let row = rows[i];
                            tbcnt.push(`<div class='row ${sstd(row.class)}' style='height:${nstd(row.height)}%;${ROW_MARGIN_STYLE}'>`);
                            __col_owner__(i, row, row.cols);
                            tbcnt.push("</div>");
                        } else {
                            let description = row.hasOwnProperty("descrip") ? row.descrip : i + 1;
                            tools.mutter(`row error: ${description}`, "error");
                        }
                    }
                }

                !function () {
                    if (config) {
                        if (config.hasOwnProperty("pane")) {
                            for (let name in config.pane) {
                                if (config.pane.hasOwnProperty(name)) {
                                    jqDom.css(name, config.pane[name]);
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

    generate(id, config) {
        let dom = document.createElement("div"),
            handle = this.__init__($(dom), config);
        $(tools.identify(id)).append(dom);
        return handle;
    }
}