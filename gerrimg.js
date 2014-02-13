/* Gerrit image compare helper by Marc Englund. Inspired by TwoFace and js-imagediff. */
(function () {
    "use strict";
    var self = {
        hs: 2,
        width: 0,
        height: 0,
        ctx: null,
        divide: 1,
        dragstart: false,
        before: null,
        after: null,

        draw: function () {
            this.ctx.globalCompositeOperation = "source-over";
            this.drawImages();
            this.drawHandle();
        },
        drawImages: function () {
            var split = this.divide * this.width;
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.after, split, 0, this.width - split, this.height, split, 0, this.width - split, this.height);
            this.ctx.drawImage(this.before, 0, 0, split, this.height, 0, 0, split, this.height);
        },
        drawHandle: function () {
            var split = this.divide * this.width;
            this.ctx.fillStyle = "rgba(0,0,0, 0.3)";
            this.ctx.fillRect(split, 0, 1, this.height);
        },
        mousedown: function (event) {
            this.divide = event._x / this.width;
            this.dragstart = true;
            this.draw();
        },
        mousemove: function (event) {
            if (this.dragstart === true) {
                this.divide = event._x / this.width;
                this.draw();
            }
        },
        mouseup: function (event) {
            this.divide = event._x / this.width;
            this.dragstart = false;
            this.draw();
        },
        dblclick: function (event) {
            var c = document.createElement('canvas'),
                img = self.before;
            c.setAttribute('width', self.width);
            c.setAttribute('height', self.height);
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var bd = ctx.getImageData(0, 0, self.width, self.height);

            ctx.clearRect(0, 0, self.width, self.height);
            img = self.after;
            ctx.drawImage(img, 0, 0);
            var ad = ctx.getImageData(0, 0, self.width, self.height);

            var diff = self.diff(bd, ad);
            self.ctx.clearRect(0, 0, self.width, self.height);
            self.ctx.putImageData(diff, 0, 0);
        },
        diff: function (a, b) {
            var height = a.height,
                width = a.width,
                c = getImageData(width, height),
                aData = a.data,
                bData = b.data,
                cData = c.data,
                length = cData.length,
                row,
                column,
                i,
                j,
                k,
                v,
                columnOffset,
                rowOffset;

            for (i = 0; i < length; i += 4) {
                if (aData[i] !== bData[i] || aData[i + 1] !== bData[i + 1] || aData[i + 2] !== bData[i + 2] || aData[i + 3] !== bData[i + 3]) {
                    cData[i] = cData[i + 1] = cData[i + 2] = 0;
                    cData[i + 3] = 255;
                }
            }


            // Helpers
            function getImageData(width, height) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                context.clearRect(0, 0, width, height);
                return context.createImageData(width, height);
            }

            function offsets(imageData) {
                rowOffset = Math.floor((height - imageData.height) / 2);
                columnOffset = Math.floor((width - imageData.width) / 2);
            }

            return c;
        }

    };

    // find images
    var els = document.getElementsByClassName("fileLineDELETE");
    if (els.length && els[0].firstChild.tagName === "IMG") {
        self.before = els[0].firstChild;
    }
    els = document.getElementsByClassName("fileLineINSERT");
    if (els.length && els[0].firstChild.tagName === "IMG") {
        self.after = els[0].firstChild;
    }
    if (self.before === null || self.after === null) {
        return;
    }
    // set size
    self.width = Math.max(self.before.width, self.after.width);
    self.height = Math.max(self.before.height, self.after.height);
    // create canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', self.width);
    canvas.setAttribute('height', self.height);
    var container = self.before.parentNode;
    container.removeChild(self.before);
    container.appendChild(canvas);

    self.ctx = canvas.getContext('2d');

    function handler(ev) {
        if (ev.layerX || ev.layerX === 0) { // Firefox
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX === 0) { // Opera
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }
        var eventHandler = self[ev.type];
        if (typeof eventHandler === 'function') {
            eventHandler.call(self, ev);
        }
    }
    canvas.addEventListener('mousemove', handler, false);
    canvas.addEventListener('mousedown', handler, false);
    canvas.addEventListener('mouseup', handler, false);
    canvas.addEventListener('dblclick', handler, false);


    self.draw();

}());
