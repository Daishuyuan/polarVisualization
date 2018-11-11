import {Tools as tools} from "../basic/BasicTools.js";
import { DynamicInterval } from "../basic/DynamicInterval.js";
const LOADING_WRAPPER = `<div class="wrapper">
					<div class="inner">
						<span>L</span>
						<span>o</span>
						<span>a</span>
						<span>d</span>
						<span>i</span>
						<span>n</span>
						<span>g</span>
					</div>
				</div>`;
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
                this.timer = DynamicInterval(() => {
                    let child = this.imgList.children();
                    let len = child.length;
                    if (len > 0) {
                        child.hide();
                        $(child[(this.index++) % len]).show();
                    }
                }, this.option.tick, this.option.autoStart, true);
                if(this.option.hasOwnProperty("pauseOnHover")) {
                    this.option.pauseOnHover && this.imgList.hover(
                        () => this.timer.halt(),
                        () => this.timer.start()
                    );
                }
            }
        }
    }

    addImage(url) {
        let imgLi = $(`<li class="${this.animate}">${LOADING_WRAPPER}</li>`);
        if(this.imgList.children().length>0){
            imgLi.hide();
        }
        this.imgList.append(imgLi);
        if (!url) {
            tools.mutter("Can not find the image.", "error", ImagePlayer);
        } else {
            let img = new Image();
            img.src = url;
            img.height = this.height;
            img.width = this.width;
            img.onload = () => {
                imgLi.empty();
                $(img).css('border-radius', this.radius);
                imgLi.append(img);
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