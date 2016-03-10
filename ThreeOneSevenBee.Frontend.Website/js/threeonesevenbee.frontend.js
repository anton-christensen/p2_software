﻿(function (globals) {
    "use strict";

    Bridge.define('ThreeOneSevenBee.Frontend.App', {
        statics: {
            config: {
                init: function () {
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                var t = new ThreeOneSevenBee.Model.Template();
                console.log(t.toString());
    
                var canvas = document.getElementById("canvas");
    
                var context = new ThreeOneSevenBee.Frontend.CanvasContext(canvas);
    
                var model = new ThreeOneSevenBee.Model.Expression.ExpressionModel("4+4", [Bridge.get(ThreeOneSevenBee.Model.Expression.ExpressionRules.Rules).itselfRule, Bridge.get(ThreeOneSevenBee.Model.Expression.ExpressionRules.Rules).commutativeRule]);
    
                var view = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(600, 400), [
                    [new ThreeOneSevenBee.Model.UI.ExpressionView(model, 400, 400)],
                    [Bridge.merge(new ThreeOneSevenBee.Model.UI.LabelView("Click on a Button!"), {
                        setX: 100,
                        setY: 60,
                        setWidth: 40,
                        setHeight: 20
                    } )],
                    [Bridge.merge(new ThreeOneSevenBee.Model.UI.ButtonView("Hello", $_.ThreeOneSevenBee.Frontend.App.f1), {
                        setX: 100,
                        setY: 100,
                        setWidth: 40,
                        setHeight: 20
                    } )],
                    [Bridge.merge(new ThreeOneSevenBee.Model.UI.ButtonView("World", $_.ThreeOneSevenBee.Frontend.App.f2), {
                        setX: 200,
                        setY: 100,
                        setWidth: 40,
                        setHeight: 20
                    } )]
                ] );
    
                context.setContentView(view);
                context.draw();
            }
        }
    });
    
    var $_ = {};
    
    Bridge.ns("ThreeOneSevenBee.Frontend.App", $_)
    
    Bridge.apply($_.ThreeOneSevenBee.Frontend.App, {
        f1: function () {
            Bridge.global.alert("Hello");
        },
        f2: function () {
            Bridge.global.alert("World");
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Frontend.CanvasContext', {
        inherits: [ThreeOneSevenBee.Model.UI.Context],
        context: null,
        constructor: function (canvas) {
            ThreeOneSevenBee.Model.UI.Context.prototype.$constructor.call(this, canvas.width, canvas.height);
    
            this.context = canvas.getContext("2d");
        },
        setContentView: function (view) {
            var canvasLeft = this.context.canvas.getBoundingClientRect().left;
            var canvasRight = this.context.canvas.getBoundingClientRect().left;
            this.context.canvas.addEventListener("mousedown", function (e) {
                view.click(e.clientX - Bridge.Int.trunc(canvasLeft), e.clientY - Bridge.Int.trunc(canvasRight));
            });
            ThreeOneSevenBee.Model.UI.Context.prototype.setContentView.call(this, view);
        },
        clear: function () {
            this.context.clearRect(0, 0, Bridge.Int.trunc(this.getWidth()), Bridge.Int.trunc(this.getHeight()));
        },
        draw$3: function (view) {
            this.context.rect(view.getX(), view.getY(), view.getWidth(), view.getHeight());
            this.context.rect(view.getX(), view.getY(), view.getWidth() * view.progressbar.getPercentage(), view.getHeight());
            this.context.stroke();
        },
        draw$2: function (view) {
            this.context.textBaseline = "middle";
            this.context.textAlign = "center";
            this.context.fillText(view.getText(), Bridge.Int.trunc((view.getX() + view.getWidth() / 2)), Bridge.Int.trunc((view.getY() + view.getHeight() / 2)));
        },
        draw$1: function (view) {
            this.draw$2(Bridge.as(view, ThreeOneSevenBee.Model.UI.LabelView));
            this.context.rect(view.getX(), view.getY(), view.getWidth(), view.getHeight());
            this.context.stroke();
        }
    });
    
    Bridge.init();
})(this);
