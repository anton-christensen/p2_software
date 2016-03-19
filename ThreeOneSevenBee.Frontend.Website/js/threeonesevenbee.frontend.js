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
    
                var model = new ThreeOneSevenBee.Model.Expression.ExpressionModel("a+b*c", [Bridge.get(ThreeOneSevenBee.Model.Expression.ExpressionRules.Rules).itselfRule, Bridge.get(ThreeOneSevenBee.Model.Expression.ExpressionRules.Rules).commutativeRule]);
    
                model.getExpression().clone();
    
                var view = Bridge.merge(new ThreeOneSevenBee.Model.UI.CompositeView(600, 400), [
                    [Bridge.merge(new ThreeOneSevenBee.Model.UI.ExpressionView(model, 600, 300), {
                        setX: 0,
                        setY: 0
                    } )],
                    [Bridge.merge(new ThreeOneSevenBee.Model.UI.IdentityMenuView(model, 600, 100), {
                        setY: 300
                    } )]
                ] );
    
                context.setContentView(view);
                model.addOnChanged(function (m) {
                    context.draw();
                });
                context.draw();
            }
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Frontend.CanvasContext', {
        inherits: [ThreeOneSevenBee.Model.UI.Context],
        context: null,
        constructor: function (canvas) {
            ThreeOneSevenBee.Model.UI.Context.prototype.$constructor.call(this, canvas.width, canvas.height);
    
            this.context = canvas.getContext("2d");
            this.context.font = "12px Arial Black";
        },
        setContentView: function (view) {
            var canvasLeft = this.context.canvas.getBoundingClientRect().left;
            var canvasRight = this.context.canvas.getBoundingClientRect().left;
            this.context.canvas.addEventListener("mousedown", function (e) {
                view.click(e.clientX + document.body.scrollLeft - Bridge.Int.trunc(canvasLeft), e.clientY + document.body.scrollTop - Bridge.Int.trunc(canvasRight));
            });
            ThreeOneSevenBee.Model.UI.Context.prototype.setContentView.call(this, view);
        },
        clear: function () {
            this.context.clearRect(0, 0, Bridge.Int.trunc(this.getWidth()), Bridge.Int.trunc(this.getHeight()));
        },
        draw$4: function (view, offsetX, offsetY) {
            this.context.beginPath();
            this.context.rect(view.getX() + offsetX, view.getY() + offsetY, view.getWidth(), view.getHeight());
            this.context.rect(view.getX() + offsetX, view.getY() + offsetY, view.getWidth() * view.progressbar.getPercentage(), view.getHeight());
            this.context.closePath();
            this.context.stroke();
        },
        draw$2: function (view, offsetX, offsetY) {
            this.context.textBaseline = "middle";
            this.context.textAlign = "center";
            this.context.font = view.getHeight() / 1.5 + "px Arial Black";
            this.context.fillText(view.getText(), Bridge.Int.trunc((view.getX() + offsetX + view.getWidth() / 2)), Bridge.Int.trunc((view.getY() + offsetY + view.getHeight() / 2)));
        },
        draw$1: function (view, offsetX, offsetY) {
            this.context.fillStyle = view.getSelected() ? "lightblue" : "#eeeeee";
            this.context.fillRect(Bridge.Int.trunc((view.getX() + offsetX)), Bridge.Int.trunc((view.getY() + offsetY)), Bridge.Int.trunc(view.getWidth()), Bridge.Int.trunc(view.getHeight()));
            this.context.fillStyle = "black";
            this.draw$2(Bridge.as(view, ThreeOneSevenBee.Model.UI.LabelView), offsetX, offsetY);
        },
        draw$3: function (view, offsetX, offsetY) {
            if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.divide) {
                this.context.beginPath();
                this.context.lineCap = "round";
                this.context.lineWidth = view.getHeight() / 40;
                this.context.moveTo(view.getX() + offsetX, view.getY() + offsetY + view.getHeight() / 2);
                this.context.lineTo(view.getX() + offsetX + view.getWidth(), view.getY() + offsetY + view.getHeight() / 2);
                this.context.stroke();
            }
            else  {
                if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.multiply) {
                    this.context.beginPath();
                    //context.Rect(, view.Width / 10,);
                    this.context.arc(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2, view.getHeight() / 10, 0, 2 * Math.PI);
                    this.context.fill();
                    this.context.stroke();
                }
                else  {
                    if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.add) {
                        this.context.beginPath();
                        this.context.lineWidth = view.getHeight() / 20;
                        this.context.moveTo(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY - view.getHeight() / 3 + view.getHeight() / 2);
                        this.context.lineTo(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 3 + view.getHeight() / 2);
                        this.context.moveTo(view.getX() + offsetX - view.getWidth() / 3 + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2);
                        this.context.lineTo(view.getX() + offsetX + view.getWidth() / 3 + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2);
                        this.context.stroke();
                        this.context.closePath();
                    }
                    else  {
                        if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.subtract) {
                            this.context.beginPath();
                            this.context.lineWidth = view.getHeight() / 20;
                            this.context.moveTo(view.getX() + offsetX - view.getWidth() / 3 + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2);
                            this.context.lineTo(view.getX() + offsetX + view.getWidth() / 3 + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2);
                            this.context.stroke();
                            this.context.closePath();
                        }
                    }
                }
            }
        }
    });
    
    Bridge.init();
})(this);
