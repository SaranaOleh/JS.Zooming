function ImageObj(name, url) {
    this.name = name;
    this.url = url;
}
ImageObj.prototype.toList = function () {
    return "<li data-url='" + this.url + "'>" + this.name + "</li>"
};
var Modules = {
    init: function () {
        this.container = document.querySelector(".container");
        this.ModuleControl.init();
        this.ModuleList.init();
        this.ModuleView.init()
    },
    ModuleView: {
        init: function () {
            this.container = Modules.container.querySelector(".preview");
            this.zoom = this.container.querySelector(".zoom");
            this.img = this.container.querySelector(".img");
            this.imgCont = this.container.querySelector(".img_cont");
            this.getImage();
            this.createZoomStream();
        },
        getImage: function () {
            var self = this;
            Modules.ModuleList.listStream.subscribe(function (e) {
                if(e.target.tagName === "LI")  self.img.src = e.target.dataset.url;
            })
        },
        createZoomStream: function () {
            var self = this;
            this.zoomStream = Rx.Observable.fromEvent(this.zoom,"input");
            this.zoomStream.subscribe(function (e) {
                self.imgCont.style.width = e.target.value + "px";
            })
        }
    },
    ModuleControl: {
        init: function () {
            this.container = Modules.container.querySelector(".add");
            this.add = this.container.querySelector(".button");
            this.getImage();
        },
        getImage: function () {
            this.addStream = Rx.Observable.fromEvent(this.add,"click").map(function (e) {
                var exp = e.target.previousElementSibling.value.split(".");
                if(
                    e.target.previousElementSibling.previousElementSibling.value === "" ||
                    e.target.previousElementSibling.value === ""
                ){return false}
                if(
                    exp[exp.length-1] !== "gif" &&
                    exp[exp.length-1] !== "png" &&
                    exp[exp.length-1] !== "jpg"
                ){ return false}
                else {
                    return new ImageObj(
                        e.target.previousElementSibling.previousElementSibling.value,
                        e.target.previousElementSibling.value
                    );
                }
            });
        }
    },
    ModuleList: {
        init: function () {
            this.container = Modules.container.querySelector(".list");
            var self = this;
            Modules.ModuleControl.addStream.subscribe(function (data) {
                if(data) self.container.insertAdjacentHTML("beforeend", data.toList());
            });
            this.createStreamToView();
        },
        createStreamToView: function () {
            this.listStream = Rx.Observable.fromEvent(this.container,"click");
        }
    }
};
Modules.init();