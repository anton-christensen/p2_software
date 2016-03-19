﻿(function (globals) {
    "use strict";

    Bridge.define('ThreeOneSevenBee.Model.UI.View', {
        onClick: null,
        config: {
            properties: {
                Width: 0,
                Height: 0,
                X: 0,
                Y: 0,
                Baseline: 0,
                Name: null,
                Selected: false
            }
        },
        click: function (x, y) {
            if (this.containsPoint(x, y) && Bridge.hasValue(this.onClick)) {
                this.onClick();
            }
        },
        scale: function (factor) {
            this.setX(this.getX()*factor);
            this.setY(this.getY()*factor);
            this.setWidth(this.getWidth()*factor);
            this.setHeight(this.getHeight()*factor);
            return this;
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
            this._contentView.drawWithContext(this, 0, 0);
        },
        draw$1: function (view, offsetX, offsetY) {
            this.draw$2(Bridge.as(view, ThreeOneSevenBee.Model.UI.LabelView), offsetX, offsetY);
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
        getProgress: function () {
            return this._currentProgress;
        },
        setProgress: function (value) {
            this._currentProgress = value;
        },
        getPercentage: function () {
            return Bridge.cast(this._currentProgress, Number) / this._maxProgress;
        },
        getMaxProgress: function () {
            return this._maxProgress;
        },
        setMaxProgress: function (value) {
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
        drawWithContext: function (context, offsetX, offsetY) {
            context.draw$2(this, offsetX, offsetY);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.CompositeView', {
        inherits: [ThreeOneSevenBee.Model.UI.View,Bridge.IEnumerable$1(ThreeOneSevenBee.Model.UI.View)],
        children: null,
        config: {
            properties: {
                PropagateClick: false
            }
        },
        constructor: function (width, height) {
            ThreeOneSevenBee.Model.UI.View.prototype.$constructor.call(this);
    
            this.setWidth(width);
            this.setHeight(height);
            this.children = new Bridge.List$1(ThreeOneSevenBee.Model.UI.View)();
            this.setPropagateClick(true);
        },
        drawWithContext: function (context, offsetX, offsetY) {
            var $t;
            $t = Bridge.getEnumerator(this.children);
            while ($t.moveNext()) {
                var child = $t.getCurrent();
                child.drawWithContext(context, offsetX + this.getX(), offsetY + this.getY());
            }
        },
        click: function (x, y) {
            var $t;
            if (ThreeOneSevenBee.Model.UI.View.prototype.containsPoint.call(this, x, y)) {
                if (this.getPropagateClick()) {
                    $t = Bridge.getEnumerator(this.children);
                    while ($t.moveNext()) {
                        var child = $t.getCurrent();
                        child.click(x - this.getX(), y - this.getY());
                    }
                }
    
                if (Bridge.hasValue(this.onClick)) {
                    this.onClick();
                }
            }
        },
        scale: function (factor) {
            var $t;
            $t = Bridge.getEnumerator(this.children);
            while ($t.moveNext()) {
                var child = $t.getCurrent();
                child.scale(factor);
            }
            return ThreeOneSevenBee.Model.UI.View.prototype.scale.call(this, factor);
        },
        getEnumerator$1: function () {
            return this.children.getEnumerator();
        },
        getEnumerator: function () {
            return this.getEnumerator$1();
        },
        add: function (view) {
            this.children.add(view);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ProgressbarStarView', {
        inherits: [ThreeOneSevenBee.Model.UI.View],
        progressbar: null,
        constructor: function (progressbar) {
            ThreeOneSevenBee.Model.UI.View.prototype.$constructor.call(this);
    
            this.progressbar = new ThreeOneSevenBee.Model.UI.ProgressbarStar(50, 100);
        },
        drawWithContext: function (context, offsetX, offsetY) {
            context.draw$4(this, offsetX, offsetY);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ButtonView', {
        inherits: [ThreeOneSevenBee.Model.UI.LabelView],
        constructor: function (text, onClick) {
            ThreeOneSevenBee.Model.UI.LabelView.prototype.$constructor.call(this, text);
    
            this.onClick = onClick;
        },
        drawWithContext: function (context, offsetX, offsetY) {
            context.draw$1(this, offsetX, offsetY);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.ExpressionView', {
        inherits: [ThreeOneSevenBee.Model.UI.CompositeView],
        statics: {
            nUMVAR_SIZE: 20,
            build: function (expression, model) {
                var $t, $t1;
                var minusExpression = Bridge.as(expression, ThreeOneSevenBee.Model.Expression.Expressions.UnaryMinusExpression);
                if (Bridge.hasValue(minusExpression)) {
                    var view = Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(minusExpression.getExpression(), model);
                    var operatorView = new ThreeOneSevenBee.Model.UI.OperatorButtonView(minusExpression.getType(), null);
                    operatorView.setWidth(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                    operatorView.setHeight(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                    operatorView.setBaseline(Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2));
                    view.setX(operatorView.getWidth());
                    operatorView.setY(view.getBaseline() - operatorView.getBaseline());
                    var minusView = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(operatorView.getWidth() + view.getWidth(), view.getHeight()), [
                        [operatorView],
                        [view]
                    ] );
                    minusView.setBaseline(view.getBaseline());
                    return minusView;
                }
                var operatorExpression = Bridge.as(expression, ThreeOneSevenBee.Model.Expression.Expressions.BinaryOperatorExpression);
                if (Bridge.hasValue(operatorExpression)) {
                    var left = Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(operatorExpression.getLeft(), model);
                    var right = Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(operatorExpression.getRight(), model);
                    var operatorView1 = new ThreeOneSevenBee.Model.UI.OperatorButtonView(operatorExpression.getType(), null);
                    switch (operatorExpression.getType()) {
                        case ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.divide: 
                            var width = Math.max(left.getWidth(), right.getWidth()) + Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE;
                            operatorView1.setWidth(width);
                            operatorView1.setHeight(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                            operatorView1.setY(left.getHeight());
                            operatorView1.setBaseline(Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2));
                            right.setY(left.getHeight() + operatorView1.getHeight());
                            left.setX((width - left.getWidth()) / 2);
                            right.setX((width - right.getWidth()) / 2);
                            var fraction = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(width, left.getHeight() + operatorView1.getHeight() + right.getHeight()), [
                                [left],
                                [operatorView1],
                                [right]
                            ] );
                            fraction.setBaseline(operatorView1.getY() + operatorView1.getHeight() / 2);
                            return fraction;
                        case ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.power: 
                            right.setX(left.getWidth());
                            left.setY(right.getHeight());
                            var exponent = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(right.getX() + right.getWidth(), left.getY() + left.getHeight()), [
                                [left],
                                [right]
                            ] );
                            exponent.setBaseline(exponent.getHeight() - left.getBaseline());
                            return exponent;
                        case ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.subtract: 
                            var baseline = Math.max(operatorView1.getBaseline(), left.getBaseline(), right.getBaseline());
                            operatorView1.setX(left.getWidth());
                            operatorView1.setWidth(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                            operatorView1.setHeight(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                            operatorView1.setBaseline(Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2));
                            right.setX(left.getWidth() + operatorView1.getWidth());
                            left.setY(baseline - left.getBaseline());
                            operatorView1.setY(baseline - operatorView1.getBaseline());
                            right.setY(baseline - right.getBaseline());
                            var height = Math.max(left.getY() + left.getHeight(), operatorView1.getY() + operatorView1.getHeight(), right.getY() + right.getHeight());
                            var subtraction = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(right.getX() + right.getWidth(), height), [
                                [left],
                                [operatorView1],
                                [right]
                            ] );
                            subtraction.setBaseline(baseline);
                            return subtraction;
                    }
                }
                var variadicExpression = Bridge.as(expression, ThreeOneSevenBee.Model.Expression.Expressions.VariadicOperatorExpression);
                if (Bridge.hasValue(variadicExpression)) {
                    var views = new Bridge.List$1(ThreeOneSevenBee.Model.UI.View)();
                    var offsetX = 0;
                    var height1 = 0;
                    var maxBaseline = Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2);
                    $t = Bridge.getEnumerator(variadicExpression);
                    while ($t.moveNext()) {
                        var expr = $t.getCurrent();
                        if (views.getCount() !== 0) {
                            var operatorView2 = new ThreeOneSevenBee.Model.UI.OperatorButtonView(variadicExpression.getType(), null);
                            operatorView2.setX(offsetX);
                            operatorView2.setWidth(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                            operatorView2.setHeight(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE);
                            operatorView2.setBaseline(Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2));
                            views.add(operatorView2);
                            offsetX += operatorView2.getWidth();
                        }
                        var operand = Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(expr, model);
                        maxBaseline = Math.max(maxBaseline, operand.getBaseline());
                        operand.setX(offsetX);
                        offsetX += operand.getWidth();
                        views.add(operand);
                    }
                    $t1 = Bridge.getEnumerator(views);
                    while ($t1.moveNext()) {
                        var view1 = $t1.getCurrent();
                        view1.setY(maxBaseline - view1.getBaseline());
                        height1 = Math.max(height1, view1.getY() + view1.getHeight());
                    }
                    return Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(offsetX, height1), {
                        children: views,
                        setBaseline: maxBaseline
                    } );
                }
                return Bridge.merge(new ThreeOneSevenBee.Model.UI.ButtonView(expression.toString(), function () {
                    model.select(expression);
                }), {
                    setWidth: Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE,
                    setHeight: Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE,
                    setBaseline: Bridge.Int.div(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).nUMVAR_SIZE, 2),
                    setSelected: model.selectionIndex(expression) !== -1
                } );
    
            }
        },
        constructor: function (model, width, height) {
            ThreeOneSevenBee.Model.UI.CompositeView.prototype.$constructor.call(this, width, height);
    
            this.children = new Bridge.List$1(ThreeOneSevenBee.Model.UI.View)();
            this.children.add(this.fit(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(model.getExpression(), model)));
            model.addOnChanged(Bridge.fn.bind(this, $_.ThreeOneSevenBee.Model.UI.ExpressionView.f1));
        },
        fit: function (view) {
            return view.scale(Math.min(this.getWidth() / view.getWidth(), this.getHeight() / view.getHeight()));
        }
    });
    
    var $_ = {};
    
    Bridge.ns("ThreeOneSevenBee.Model.UI.ExpressionView", $_)
    
    Bridge.apply($_.ThreeOneSevenBee.Model.UI.ExpressionView, {
        f1: function (m) {
            this.children.clear();
            this.children.add(this.fit(Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(m.getExpression(), m)));
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.IdentityMenuView', {
        inherits: [ThreeOneSevenBee.Model.UI.CompositeView],
        constructor: function (model, width, height) {
            ThreeOneSevenBee.Model.UI.CompositeView.prototype.$constructor.call(this, width, height);
    
            this.children = this.build(model.getIdentities(), model);
            model.addOnChanged(Bridge.fn.bind(this, $_.ThreeOneSevenBee.Model.UI.IdentityMenuView.f1));
        },
        build: function (identities, model) {
            var views = new Bridge.List$1(ThreeOneSevenBee.Model.UI.View)();
            var x = 0;
            for (var index = 0; index < Bridge.Linq.Enumerable.from(identities).count(); index++) {
                (function () {
                    var indexCopy = index;
                    var view = Bridge.get(ThreeOneSevenBee.Model.UI.ExpressionView).build(identities.getItem(index), model);
                    var Container = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(view.getWidth(), view.getHeight()), {
                        setPropagateClick: false
                    } );
                    Container.add(view);
                    Container.setX(x);
                    x += Container.getWidth() + 20;
                    Container.onClick = function () {
                        model.applyIdentity(identities.getItem(indexCopy));
                    };
                    views.add(Container);
                }).call(this);
            }
            return views;
        },
        click: function (x, y) {
            ThreeOneSevenBee.Model.UI.CompositeView.prototype.click.call(this, x, y);
        }
    });
    
    Bridge.ns("ThreeOneSevenBee.Model.UI.IdentityMenuView", $_)
    
    Bridge.apply($_.ThreeOneSevenBee.Model.UI.IdentityMenuView, {
        f1: function (m) {
            this.children = this.build(m.getIdentities(), m);
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Model.UI.OperatorButtonView', {
        inherits: [ThreeOneSevenBee.Model.UI.ButtonView],
        config: {
            properties: {
                type: null
            }
        },
        constructor: function (type, onClick) {
            ThreeOneSevenBee.Model.UI.ButtonView.prototype.$constructor.call(this, "", onClick);
    
            this.settype(type);
        },
        drawWithContext: function (context, offsetX, offsetY) {
            context.draw$3(this, offsetX, offsetY);
        }
    });
    
    Bridge.init();
})(this);
