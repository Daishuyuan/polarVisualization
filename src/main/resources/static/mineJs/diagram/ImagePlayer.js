import {Tools as tools} from "../basic/BasicTools.js"

/**
 * @name ImagePlayer 图片播放器
 * @author zxj 2018/11/07
 */
export class ImagePlayer {
    constructor(dom, option) {
        if (!option) {
            tools.mutter("Please give me the player correct option.", "error", ImagePlayer);
        } else if (!option.height || !option.width) {
            tools.mutter("Please set the height/width of the player.", "error", ImagePlayer);
        } else if (!option.animate) {
            tools.mutter("Please set the animate.", "error", ImagePlayer);
        } else if (!option.radius) {
            tools.mutter("Please set the border-radius", "error", ImagePlayer)
        } else {
            this.option = option;
            this.height = option.height;
            this.width = option.width;
            this.animate = option.animate;
            this.radius = option.radius;
            this.index = 0;
            this.imgList = $("<ul style='padding: 0;'></ul>");
            dom.append(this.imgList);
            if (!this.option.tick) {
                tools.mutter("Please set the interval of player.", "error", ImagePlayer);
            } else {
                this.timer = tools.dynamicInterval(() => {
                    let child = this.imgList.children();
                    let len = child.length;
                    if (len > 0) {
                        child.hide();
                        $(child[(this.index++) % len]).show();
                    }
                }, this.option.tick, false);
                this.option.autoStart && this.start();
            }
        }
    }

    addImage(url) {
        if (!url) {
            tools.mutter("Can not find the image.", "error", ImagePlayer);
        } else {
            let img = new Image();
            img.src = url;
            img.height = this.height;
            img.width = this.width;
            img.onload = () => {
                let imgLi = $(`<li class="${this.animate}"></li>`);
                $(img).css('border-radius', this.radius);
                imgLi.append(img).hide();
                this.imgList.append(imgLi);
            }
        }
    }

    start() {
        this.timer.start();
    }

    halt() {
        this.timer.halt();
    }
}