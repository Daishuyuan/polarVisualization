import {Tools as tools} from "./BasicTools.js"

export var TYPE_ECHARTS = "echarts";
export var TYPE_CUSTOM = "custom";
const SHARE_RES_MAP = new Map();
const SUBSCRIBERS = [];
const USE_ERROR_LOG = true;

export class DataPublisher {
    constructor() {
        // update entity by type
        this._updateData = (entity, data) => {
            switch (entity.type) {
                case TYPE_ECHARTS:
                    entity.target.setOption(data, true);
                    break;
                case TYPE_CUSTOM:
                    entity.target(data);
                    break;
                default:
                    tools.mutter(`type=${entity.type} is invalid.`, "error");
                    break;
            }
            entity.isInited = true;
        };

        // pull resouce from remote or local
        this._reqRes = (entity) => {
            if (SHARE_RES_MAP.has(entity.url)) {
                if (!entity.isInited) {
                    this._updateData(entity, SHARE_RES_MAP.get(entity.url));
                }
            } else {
                $.ajax({
                    url: entity.url,
                    type: "POST",
                    dataType: "json"
                }).done((data) => {
                    SHARE_RES_MAP.set(entity.url, data);
                    this._updateData(entity, data);
                });
            }
        };

        // materialize entity
        this._materialize = (entity) => {
            let _url = entity.url,
                _type = entity.type,
                _target = entity.target;
            Object.defineProperty(entity, "url", {
                get() {
                    return _url;
                },
                set(url) {
                    if (url && url !== _url) {
                        _url = url;
                        this._reqRes(entity);
                    }
                }
            });
            Object.defineProperty(entity, "type", {
                get() {
                    return _type;
                },
                set(type) {
                    if (type && type !== _type) {
                        _type = type;
                        this._reqRes(entity);
                    }
                }
            });
            Object.defineProperty(entity, "target", {
                get() {
                    return _target;
                }
            });
        };

        // Check and pull data trigger;
        if (!!window.EventSource) {
            let source = new EventSource('/push');
            source.onmessage = (e) => {
                let props = e.data.split(",");
                if (props.length > 0) {
                    // check data updating in props diagram
                    for (let i = 0; i < props.length; ++i) {
                        if (USE_ERROR_LOG && "error" === props[i]) {
                            $.ajax("/api/errors").done((data) => {
                                data.length = Math.min(data.length, 5);
                                data = ['出错: '].concat(data).join('</br>');
                                layer.alert(data, {
                                    icon: 2
                                });
                            });
                        }
                        let it = SHARE_RES_MAP.keys(), e, name = props[i];
                        while (!(e = it.next()).done) {
                            if ((e.value + "").indexOf(name) >= 0) {
                                SHARE_RES_MAP.delete(e.value);
                            }
                        }
                    }
                    // check data validation in subscribers
                    for (let i = 0; i < SUBSCRIBERS.length; ++i) {
                        this._reqRes(SUBSCRIBERS[i]);
                    }
                }
            };
        } else {
            tools.mutter("your browser don't support EventSource", "error");
        }
    }

    // subscrib entity to map(entity should be configured by url, target and type)
    subscrib(entity) {
        if (entity.url && entity.target && entity.type) {
            this._materialize(entity);
            this._reqRes(entity);
            SUBSCRIBERS.push(entity);
        } else {
            tools.mutter(`entity.url=${entity.url}, entity.target=${entity.target}, entity.type=${entity.type} invalid.`, "error");
        }
    }
}