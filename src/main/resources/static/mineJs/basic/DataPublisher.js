import {Tools as tools} from "./BasicTools.js"

/**
 * share resource (this resource is what has been downloaded from server by url)
 * in this map for that we don't want same url and same resource to download twice.
 * And we want to notice subscribers to take the real-time resource by removing its url in it.
 *
 * @type {Map<any, any>}
 */
const SHARE_RES_MAP = new Map();
/**
 * subscribers list used to record current subscribers( this means they want download
 * resource from their url)
 *
 * @type {Array}
 */
const SUBSCRIBERS = [];

/**
 * used to publish data and pull data from server
 *
 * @author dsy zxj 2018/10/23
 */
export class DataPublisher {
    constructor(params) {
        tools.watch("shareResourceMap", SHARE_RES_MAP);

        // update entity
        this._updateData = (entity, data) => {
            entity.target(data);
            entity.isInited = true;
        };

        // pull resource from remote or local
        this._reqRes = (entity) => {
            if (SHARE_RES_MAP.has(entity.url)) {
                // when entity is initialized
                if (!entity.isInited) {
                    this._updateData(entity, SHARE_RES_MAP.get(entity.url));
                }
            } else {
                $.ajax({
                    url: entity.url,
                    type: "GET",
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
                _target = entity.target;
            Object.defineProperty(entity, "url", {
                configurable: true,
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
            Object.defineProperty(entity, "target", {
                configurable: true,
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
                        if (!params.use_error_log && "error" === props[i]) {
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
        if (entity.url && typeof(entity.target) === "function") {
            this._materialize(entity);
            this._reqRes(entity);
            SUBSCRIBERS.push(entity);
        } else {
            tools.mutter(`entity.url=${entity.url}, entity.target=${entity.target} invalid.`, "error");
        }
    }
}