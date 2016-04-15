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
                var canvas = document.getElementById("canvas");
                canvas.width = document.documentElement.clientWidth;
                canvas.height = document.documentElement.clientHeight;
    
                var context = new ThreeOneSevenBee.Frontend.CanvasContext(canvas);
    
                var gameAPI = new ThreeOneSevenBee.Frontend.JQueryGameAPI();
    
                var testCategories = new ThreeOneSevenBee.Model.Game.LevelCategory("test");
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "-4-40+5-9", "-4-40+5-9", ["44"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
                testCategories.add(new ThreeOneSevenBee.Model.Game.Level("constructor$1", "4+44", "4+44", ["48"]));
    
                var gameModel;
                var gameView;
    
                gameAPI.getCurrentPlayer(function (u) {
                    gameAPI.getPlayers(function (p) {
                        gameModel = new ThreeOneSevenBee.Model.Game.GameModel(u, p);
                        gameModel.getUser().addCategory(testCategories);
                        gameView = new ThreeOneSevenBee.Model.UI.GameView(gameModel, context);
                    });
                });
            }
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Frontend.CanvasContext', {
        inherits: [ThreeOneSevenBee.Model.UI.Context],
        imageCache: null,
        context: null,
        constructor: function (canvas) {
            ThreeOneSevenBee.Model.UI.Context.prototype.$constructor.call(this, canvas.width, canvas.height);
    
            this.imageCache = new Bridge.Dictionary$2(String,HTMLImageElement)();
    
            this.context = canvas.getContext("2d");
            this.context.fillStyle = "#000000";
            this.context.lineWidth = 2;
            this.context.textBaseline = "middle";
    
            var canvasLeft = this.context.canvas.getBoundingClientRect().left;
            var canvasRight = this.context.canvas.getBoundingClientRect().left;
            this.context.canvas.addEventListener("mousedown", Bridge.fn.bind(this, function (e) {
                this.click(e.clientX + document.body.scrollLeft - Bridge.Int.trunc(canvasLeft), e.clientY + document.body.scrollTop - Bridge.Int.trunc(canvasRight));
            }));
        },
        setContentView: function (view) {
            ThreeOneSevenBee.Model.UI.Context.prototype.setContentView.call(this, view);
            this.draw();
        },
        clear: function () {
            this.context.clearRect(0, 0, Bridge.Int.trunc(this.getWidth()), Bridge.Int.trunc(this.getHeight()));
        },
        click: function (x, y) {
            this.contentView.click(x, y);
        },
        draw$3: function (view, offsetX, offsetY) {
            this.draw$9(Bridge.as(view, ThreeOneSevenBee.Model.UI.View), offsetX, offsetY);
            this.context.font = view.getFontSize() + "px " + view.getFont();
            this.context.textAlign = view.getAlign() === "center" ? "center" : "left";
            this.context.fillStyle = view.getFontColor();
            this.context.fillText(view.getText(), Bridge.Int.trunc((view.getX() + offsetX + (view.getAlign() === "center" ? view.getWidth() / 2 : 5))), Bridge.Int.trunc((view.getY() + offsetY + view.getHeight() / 2)));
            this.context.fillStyle = "#000000";
        },
        draw$4: function (view, offsetX, offsetY) {
            this.draw$9(Bridge.as(view, ThreeOneSevenBee.Model.UI.View), offsetX, offsetY);
            if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.divide) {
                this.context.beginPath();
                this.context.moveTo(view.getX() + offsetX, view.getY() + offsetY + view.getHeight() / 2);
                this.context.lineTo(view.getX() + offsetX + view.getWidth(), view.getY() + offsetY + view.getHeight() / 2);
                this.context.stroke();
            }
            else  {
                if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.multiply) {
                    this.context.beginPath();
                    this.context.arc(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 2, view.getHeight() / 10, 0, 2 * Math.PI);
                    this.context.fill();
                    this.context.stroke();
                }
                else  {
                    if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.add) {
                        this.context.beginPath();
                        this.context.moveTo(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY - view.getHeight() / 3 + view.getHeight() / 2);
                        this.context.lineTo(view.getX() + offsetX + view.getWidth() / 2, view.getY() + offsetY + view.getHeight() / 3 + view.getHeight() / 2);
                        this.context.moveTo(view.getX() + offsetX + view.getWidth() / 2 - view.getHeight() / 3, view.getY() + offsetY + view.getHeight() / 2);
                        this.context.lineTo(view.getX() + offsetX + view.getWidth() / 2 + view.getHeight() / 3, view.getY() + offsetY + view.getHeight() / 2);
                        this.context.stroke();
                    }
                    else  {
                        if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.subtract) {
                            this.context.beginPath();
                            this.context.moveTo(view.getX() + offsetX + view.getWidth() / 2 - view.getHeight() / 3, view.getY() + offsetY + view.getHeight() / 2);
                            this.context.lineTo(view.getX() + offsetX + view.getWidth() / 2 + view.getHeight() / 3, view.getY() + offsetY + view.getHeight() / 2);
                            this.context.stroke();
                        }
                        else  {
                            if (view.gettype() === ThreeOneSevenBee.Model.Expression.Expressions.OperatorType.minus) {
                                this.context.beginPath();
                                this.context.moveTo(view.getX() + offsetX + view.getWidth() / 3, view.getY() + offsetY + view.getHeight() / 2);
                                this.context.lineTo(view.getX() + offsetX + view.getWidth(), view.getY() + offsetY + view.getHeight() / 2);
                                this.context.stroke();
                            }
                        }
                    }
                }
            }
        },
        draw$5: function (view, offsetX, offsetY) {
            if (view.getType() === ThreeOneSevenBee.Model.UI.ParenthesisType.left) {
                this.context.beginPath();
                this.context.ellipse(view.getX() + view.getWidth() + offsetX, view.getY() + view.getHeight() / 2 + offsetY, view.getWidth(), 1.1 * view.getHeight() / 2, 0, -1.141096661 + Math.PI, 1.141096661 + Math.PI);
                this.context.stroke();
            }
            else  {
                this.context.beginPath();
                this.context.ellipse(view.getX() + offsetX, view.getY() + view.getHeight() / 2 + offsetY, view.getWidth(), 1.1 * view.getHeight() / 2, 0, -1.141096661, 1.141096661);
                this.context.stroke();
            }
        },
        draw$8: function (view, offsetX, offsetY) {
            this.context.beginPath();
            this.context.moveTo(view.getX() + offsetX + view.getSignWidth() / 8, view.getY() + offsetY + view.getHeight() - view.getSignWidth() / 2);
            this.context.lineTo(view.getX() + offsetX + view.getSignWidth() / 4, view.getY() + offsetY + view.getHeight() - view.getSignWidth() / 2);
            this.context.lineTo(view.getX() + offsetX + view.getSignWidth() / 2, view.getY() + offsetY + view.getHeight());
            this.context.lineTo(view.getX() + offsetX + view.getSignWidth(), view.getY() + offsetY + view.getTopHeight() / 2);
            this.context.lineTo(view.getX() + offsetX + view.getWidth(), view.getY() + offsetY + view.getTopHeight() / 2);
            this.context.stroke();
        },
        draw$9: function (view, offsetX, offsetY) {
            this.context.fillStyle = view.getBackgroundColor();
            this.context.fillRect(Bridge.Int.trunc((view.getX() + offsetX)), Bridge.Int.trunc((view.getY() + offsetY)), Bridge.Int.trunc(view.getWidth()), Bridge.Int.trunc(view.getHeight()));
            this.context.fillStyle = "#000000";
        },
        draw$2: function (view, offsetX, offsetY) {
            this.draw$9(Bridge.as(view, ThreeOneSevenBee.Model.UI.View), offsetX, offsetY);
    
            if (this.imageCache.containsKey(view.getImage())) {
                this.context.fillStyle = "transparent";
                this.context.drawImage(this.imageCache.get(view.getImage()), view.getX() + offsetX, view.getY() + offsetY, view.getWidth(), view.getHeight());
                this.context.fillStyle = "#000000";
            }
            else  {
                this.imageCache.set(view.getImage(), new Image());
                this.imageCache.get(view.getImage()).src = "img/" + view.getImage();
                this.imageCache.get(view.getImage()).onload = Bridge.fn.bind(this, function (e) {
                    this.context.fillStyle = "transparent";
                    this.context.drawImage(this.imageCache.get(view.getImage()), view.getX() + offsetX, view.getY() + offsetY, view.getWidth(), view.getHeight());
                    this.context.fillStyle = "#000000";
                });
            }
        },
        draw$6: function (view, offsetX, offsetY) {
            this.context.fillStyle = view.fillStyle;
            if (view.getcornerPositions().getCount() < 3) {
                throw new Bridge.Exception("Polygon does not contain enough corners");
            }
            this.context.beginPath();
            this.context.moveTo(view.getcornerPositions().getItem(0).x + offsetX, view.getcornerPositions().getItem(0).y + offsetY);
            for (var i = 1; i < view.getcornerPositions().getCount(); i++) {
                this.context.lineTo(view.getcornerPositions().getItem(i).x + offsetX, view.getcornerPositions().getItem(i).y + offsetY);
            }
            this.context.closePath();
            this.context.stroke();
            this.context.fill();
        }
    });
    
    Bridge.define('ThreeOneSevenBee.Frontend.JQueryGameAPI', {
        inherits: [ThreeOneSevenBee.Model.Game.GameAPI],
        getReady: function () {
            throw new Bridge.NotImplementedException();
        },
        getCategories: function (callback) {
            $.get("/api/?action=get_levels", { }, function (data, textStatus, request) {
                var $t, $t1;
                var jdata = JSON.parse(Bridge.cast(data, String));
    
                var categories = new Bridge.List$1(ThreeOneSevenBee.Model.Game.LevelCategory)();
                var categoriesData = Bridge.as(jdata.data, Array);
    
                $t = Bridge.getEnumerator(categoriesData);
                while ($t.moveNext()) {
                    var categoryData = $t.getCurrent();
    
                    var levelCategory = new ThreeOneSevenBee.Model.Game.LevelCategory(Bridge.cast(categoryData.name, String));
                    var levelsData = Bridge.as(categoryData.levels, Array);
                    $t1 = Bridge.getEnumerator(levelsData);
                    while ($t1.moveNext()) {
                        var levelData = $t1.getCurrent();
                        var level = new ThreeOneSevenBee.Model.Game.Level("constructor$1", Bridge.cast(levelData.initial_expression, String), Bridge.cast(levelData.initial_expression, String), Bridge.Linq.Enumerable.from((Bridge.as(levelData.star_expressions, Array))).select($_.ThreeOneSevenBee.Frontend.JQueryGameAPI.f1).toArray());
                        levelCategory.add(level);
                    }
                    categories.add(levelCategory);
                }
    
                callback(categories);
            });
        },
        getCurrentPlayer: function (callback) {
            $.get("/api/?action=get_current_user&debug=1", { }, Bridge.fn.bind(this, function (data, textStatus, request) {
                var jdata = JSON.parse(Bridge.cast(data, String));
                var currentPlayer = new ThreeOneSevenBee.Model.Game.CurrentPlayer(Bridge.cast(jdata.data.name, String));
                this.getCategories(function (categories) {
                    var $t;
                    $t = Bridge.getEnumerator(categories);
                    while ($t.moveNext()) {
                        var category = $t.getCurrent();
                        currentPlayer.addCategory(category);
                    }
                    console.log(currentPlayer);
                    callback(currentPlayer);
                });
            }));
        },
        getPlayers: function (callback) {
            $.get("/api/?action=get_users", { }, function (data, textStatus, request) {
                var jdata = JSON.parse(Bridge.cast(data, String));
                var result = Bridge.Linq.Enumerable.from((Bridge.as(jdata.data, Array))).select($_.ThreeOneSevenBee.Frontend.JQueryGameAPI.f2).toList(ThreeOneSevenBee.Model.Game.Player);
                callback(result);
            });
        },
        updateCurrentPlayer: function (currentPlayer) {
            throw new Bridge.NotImplementedException();
        }
    });
    
    var $_ = {};
    
    Bridge.ns("ThreeOneSevenBee.Frontend.JQueryGameAPI", $_)
    
    Bridge.apply($_.ThreeOneSevenBee.Frontend.JQueryGameAPI, {
        f1: function (o) {
            return Bridge.cast(o, String);
        },
        f2: function (s) {
            return new ThreeOneSevenBee.Model.Game.Player(Bridge.cast(s.name, String));
        }
    });
    
    Bridge.init();
})(this);
