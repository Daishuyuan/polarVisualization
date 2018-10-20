import { Tools as tools } from "./BasicTools.js"

export var TYPE_ECHARTS = "echarts";
export var TYPE_CUSTOM = "custom";
const SHARE_RES_MAP = new Map();
const SUBSCRIBERS = [];

export class DataPublisher {
    constructor(propsUrl) {
        // update entity by type
        this._updateData = (entity, data) => {
            switch(entity.type) {
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
        }

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
        }

        // innerify entity
        this._innerify = (entity) => {
            let _url = entity.url,
                _type = entity.type,
                _target = entity.target;
            Object.defineProperty(entity, "url", {
                get() {
                    return _url;
                },
                set(url) {
                    if (url && url != _url) {
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
                    if (type && type != _type) {
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
        }
        
        // check and pull data trigger
        if (!!window.EventSource) {
            let source = new EventSource('dataStatus');
            source.addEventListener('message', function (e) {
                let props = e.data;
                // check data updating in props diagram
                for (let name in props) {
                    if (props[name]) {
                        let it = SHARE_RES_MAP.keys(), e;
                        while(!(e = it.next()).done) {
                            if ((e.value + "").indexOf(name) >= 0) {
                                SHARE_RES_MAP.delete(e.value);
                            }
                        }
                    }
                }
                // check data validation in subscribers
                for (let i=0; i < SUBSCRIBERS.length; ++i) {
                    this._reqRes(SUBSCRIBERS[i]);
                }
            });

            source.addEventListener('open', function (e) {
                tools.mutter("begin to listen the status of data", "info");
            }, false);
            
            source.addEventListener('error', function (e) {
                if (e.readyState == EventSource.CLOSED) {
                    tools.mutter("listener of data status is closed.", "info");
                } else {
                    tools.mutter(`current state: ${e.readyState}`, "info");
                }
            }, false);
        } else {
            tools.mutter("your browser don't support EventSource", "error");
        }
    }

    // subscrib entity to map(entity should be configured by url, target and type)
    subscrib(entity) {
        if(entity.url && entity.target && entity.type) {
            this._innerify(entity);
            this._reqRes(entity);
            SUBSCRIBERS.push(entity);
        } else {
            tools.mutter(`entity.url=${entity.url}, entity.target=${entity.target}, entity.type=${entity.type} invalid.`, "error");
        }
    }
}