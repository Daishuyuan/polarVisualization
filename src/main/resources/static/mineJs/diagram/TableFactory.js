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
 * @requires jQuery
 * @requires echarts
 * @requires echarts-liquidfill
 * @requires BasicTools
 * @requires bootstrap
 * @exports TableFactory
 **/
import { Tools as tools } from "../basic/BasicTools.js"
import { PARAMS_TABLE as ptable } from "../basic/ParamsTable.js"
import { TYPE_ECHARTS } from "../basic/DataPublisher.js"

export class TableFactory {
    constructor() {
        const NO_MARGIN = "margin: 0px"; // no margin style
        const ROW_MARGIN_STYLE = "margin-right: -0.79vw;margin-left: -0.79vw;"; // row margin style
        const TITLE_DEFAULT_HEIGHT = 10; // default title height
        const guid = tools.sGuid; // guid generator
        const sstd = (x) => !!x ? x : ""; // string standard
        const nstd = (x) => !isNaN(parseFloat(x)) && x > 0 ? x : 0; // number standard

        // load chart
        function loadChart(node) {
            let dom = node.dom;
            $(dom).ready(() => {
                $.ajax({
                    url: node.url,
                    type: "GET",
                    dataType: "json",
                    success: function (option) {
                        var myChar = echarts.init(dom[0]);
                        myChar.setOption(option);
                        myChar.resize();
                        if (option.series[0].type === "gauge") {
                            setInterval(function () {
                                option.series[0].data[0].value = (Math.random() * 100 + 1).toFixed(1) - 0;
                                myChar.setOption(option, true);
                            }, 4000);
                        }
                        if (node.event_id) {
                            let entity = {
                                type: TYPE_ECHARTS,
                                url: node.url,
                                target: myChar
                            }
                            tools.setEventInApp(node.event_id, () => entity);
                        }
                    }
                });
            });
        }

        this.__init__ = (jqDom, config) => {
            jqDom.ready(function () {
                var tbcnt = [],
                    echDelay = [];

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
                                        let jqId = tools.identify(id);
                                        Object.defineProperty(node, "name", {
                                            get () {
                                                return content;
                                            },
                                            set (name) {
                                                $(jqId).html(content = name);
                                            }
                                        });
                                        tools.setEventInApp(node.event_id, () => entity);
                                    }
                                    break;
                                case "chart":
                                    let _id = `ZXJ${guid()}`.replace(/-/g, ""),
                                        title_height = 0;
                                    if (node.name) {
                                        let content_title = `<p style='margin:0;'>${sstd(node.name)}</p>`;
                                        title_height = parseInt(Math.min(Math.max(0, node.title_height ? node.title_height : TITLE_DEFAULT_HEIGHT), 100));
                                        tbcnt.push(`<div class='${sstd(node.title_class)}' style="height: ${title_height}%;text-align: center;margin:0;">${content_title}</div>`);
                                    }
                                    tbcnt.push(`<div id='${_id}' style='height:${100 - title_height}%;' class='${sstd(node.style)}'></div>`);
                                    echDelay.push({
                                        event_id: node.event_id,
                                        id: _id,
                                        url: node.url
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
                            let descrip = row.descrip ? row.descrip : i + 1;
                            tools.mutter(`row error: ${descrip}`, "error");
                        }
                    }
                }

                ! function () {
                    try {
                        if (config) {
                            if (config.pane) {
                                for (let name in config.pane) {
                                    jqDom.css(name, config.pane[name]);
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
                            try {
                                for (let i = 0; i < echDelay.length; ++i) {
                                    let node = echDelay[i];
                                    node.dom = jqDom.find(tools.identify(node.id));
                                    loadChart(node);
                                }
                            } catch (e) {
                                tools.mutter(e, "error");
                            }
                        } else {
                            tools.mutter("config is null", "error");
                        }
                    } catch (e) {
                        tools.mutter(e, "error");
                    }
                }();
            });
        }
    }

    generate(id, config) {
        let dom = document.createElement("div");
        this.__init__($(dom), config);
        $(tools.identify(id)).append(dom);
        return dom;
    }
}