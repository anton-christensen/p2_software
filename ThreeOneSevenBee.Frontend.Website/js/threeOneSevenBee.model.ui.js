﻿(function (globals) {
    "use strict";

    Bridge.define('ThreeOneSevenBee.Model.UI.View', {
        config: {
            properties: {
                Width: 0,
                Height: 0,
                X: 0,
                Y: 0
            }
        },
        containsPoint: function (x, y) {
            return x >= this.getX() && y >= this.getY() && x <= this.getX() + this.getWidth() && y <= this.getY() + this.getHeight();
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.Context', {
        _contentView: null,
        config: {
            properties: {
                Width: 0,
                Height: 0
            }
        },
        constructor: function (width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        setContentView: function (view) {
            this._contentView = view;
        },
        draw: function () {
            this.clear();
            this._contentView.drawWithContext(this);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ProgressbarCircle', {
        starLevels: null,
        constructor: function (levels) {
            if (levels === void 0) { levels = []; }
            this.starLevels = new Bridge.List$1(ThreeOneSevenBee.Model.UI.ProgressbarStar)(levels);
        },
        add: function (level) {
            if (!this.starLevels.contains(level)) {
                this.starLevels.add(level);
            }
        },
        remove: function (level) {
            if (this.starLevels.contains(level)) {
                this.starLevels.remove(level);
            }
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ProgressbarStar', {
        _maxProgress: 0,
        _currentProgress: 0,
        _stars: null,
        constructor: function (progress, maxValue, stars) {
            if (stars === void 0) { stars = []; }
            this._currentProgress = progress;
            this._maxProgress = maxValue;
            this._stars = new Bridge.List$1(Bridge.Int)(stars);
            this.getStars();
        },
        getGetProgress: function () {
            return this._currentProgress;
        },
        setGetProgress: function (value) {
            this._currentProgress = value;
        },
        getGetMaxProgress: function () {
            return this._maxProgress;
        },
        setGetMaxProgress: function (value) {
            this._maxProgress = value;
        },
        add: function (star) {
            if (!this._stars.contains(star)) {
                this._stars.add(star);
            }
        },
        remove: function (star) {
            if (this._stars.contains(star)) {
                this._stars.remove(star);
            }
        },
        getStars: function () {
            var $t;
            var starsCount = 0;
            var totalStars = 0;
    
            $t = Bridge.getEnumerator(this._stars);
            while ($t.moveNext()) {
                var i = $t.getCurrent();
                totalStars++;
                if (i <= this._currentProgress) {
                    starsCount++;
                }
            }
            // Returns amount of reached stars.
            return starsCount;
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.CompositeView', {
        inherits: [ThreeOneSevenBee.Model.UI.View],
        children: null,
        constructor: function (width, height) {
            ThreeOneSevenBee.Model.UI.View.prototype.$constructor.call(this);
    
            this.setWidth(width);
            this.setHeight(height);
            this.children = new Bridge.List$1(ThreeOneSevenBee.Model.UI.View)();
        },
        drawWithContext: function (context) {
            var $t;
            $t = Bridge.getEnumerator(this.children);
            while ($t.moveNext()) {
                var child = $t.getCurrent();
                child.drawWithContext(context);
            }
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.LabelView', {
        inherits: [ThreeOneSevenBee.Model.UI.View],
        config: {
            properties: {
                Text: null
            }
        },
        constructor: function (text) {
            ThreeOneSevenBee.Model.UI.View.prototype.$constructor.call(this);
    
            this.setText(text);
        },
        drawWithContext: function (context) {
            context.draw$1(this);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ProgressbarStarView', {
        inherits: [ThreeOneSevenBee.Model.UI.View],
        progressbar: null,
        constructor: function (progressbar) {
            ThreeOneSevenBee.Model.UI.View.prototype.$constructor.call(this);
    
            this.progressbar = new ThreeOneSevenBee.Model.UI.ProgressbarStar(50, 100);
        },
        drawWithContext: function (context) {
            context.draw$2(this);
        }
    });
    
    Bridge.init();
})(this);