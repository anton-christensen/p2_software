﻿/* global Bridge */

"use strict";

/** @namespace ThreeOneSevenBee.Framework.Euclidean */

/**
 * Basic 2D vector.
 *
 * @public
 * @class ThreeOneSevenBee.Framework.Euclidean.Vector2
 */
Bridge.define('ThreeOneSevenBee.Framework.Euclidean.Vector2', {
    statics: {
        op_Addition: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left.x + right.x, left.y + right.y);
        },
        op_Subtraction: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left.x - right.x, left.y - right.y);
        },
        op_Multiply: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left * right.x, left * right.y);
        },
        op_Multiply$1: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left.x * right, left.y * right);
        },
        op_Division: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left / right.x, left / right.y);
        },
        op_Division$1: function (left, right) {
            return new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", left.x / right, left.y / right);
        },
        getDefaultValue: function () { return new ThreeOneSevenBee.Framework.Euclidean.Vector2(); }
    },
    x: 0,
    y: 0,
    constructor$1: function (x, y) {
        this.x = x;
        this.y = y;
    },
    constructor: function () {
    },
    toString: function () {
        return "{" + Bridge.Int.format(this.x, "0.00") + ", " + Bridge.Int.format(this.y, "0.00") + "}";
    },
    getHashCode: function () {
        var hash = 17;
        hash = hash * 23 + (this.x == null ? 0 : Bridge.getHashCode(this.x));
        hash = hash * 23 + (this.y == null ? 0 : Bridge.getHashCode(this.y));
        return hash;
    },
    equals: function (o) {
        if (!Bridge.is(o,ThreeOneSevenBee.Framework.Euclidean.Vector2)) {
            return false;
        }
        return Bridge.equals(this.x, o.x) && Bridge.equals(this.y, o.y);
    },
    $clone: function (to) {
        var s = to || new ThreeOneSevenBee.Framework.Euclidean.Vector2();
        s.x = this.x;
        s.y = this.y;
        return s;
    }
});

/**
 * A basic circle, represented as a point and a radius.
 *
 * @public
 * @class ThreeOneSevenBee.Framework.Euclidean.Circle
 */
Bridge.define('ThreeOneSevenBee.Framework.Euclidean.Circle', {
    statics: {
        getDefaultValue: function () { return new ThreeOneSevenBee.Framework.Euclidean.Circle(); }
    },
    radius: 0,
    config: {
        init: function () {
            this.center = new ThreeOneSevenBee.Framework.Euclidean.Vector2();
        }
    },
    constructor: function () {
    },
    getLeft: function () {
        return this.center.x - this.radius;
    },
    getTop: function () {
        return this.center.y - this.radius;
    },
    getRight: function () {
        return this.center.x + this.radius;
    },
    getBottom: function () {
        return this.center.y + this.radius;
    },
    contains$1: function (point) {
        var dx = point.x - this.center.x;
        var dy = point.y - this.center.y;

        var squareDist = dx * dx + dy * dy;
        var squareRadius = this.radius * this.radius;

        return squareDist <= squareRadius;
    },
    contains: function (rectangle) {
        return this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getLeft(), rectangle.getTop()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getRight(), rectangle.getTop()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getRight(), rectangle.getBottom()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getLeft(), rectangle.getBottom()).$clone());
    },
    getHashCode: function () {
        var hash = 17;
        hash = hash * 23 + (this.center == null ? 0 : Bridge.getHashCode(this.center));
        hash = hash * 23 + (this.radius == null ? 0 : Bridge.getHashCode(this.radius));
        return hash;
    },
    equals: function (o) {
        if (!Bridge.is(o,ThreeOneSevenBee.Framework.Euclidean.Circle)) {
            return false;
        }
        return Bridge.equals(this.center, o.center) && Bridge.equals(this.radius, o.radius);
    },
    $clone: function (to) {
        var s = to || new ThreeOneSevenBee.Framework.Euclidean.Circle();
        s.center = this.center;
        s.radius = this.radius;
        return s;
    }
});

/**
 * A basic rectangle represented as the location of the left top point and a width and height.
 *
 * @public
 * @class ThreeOneSevenBee.Framework.Euclidean.Rectangle
 */
Bridge.define('ThreeOneSevenBee.Framework.Euclidean.Rectangle', {
    statics: {
        getDefaultValue: function () { return new ThreeOneSevenBee.Framework.Euclidean.Rectangle(); }
    },
    width: 0,
    height: 0,
    config: {
        init: function () {
            this.location = new ThreeOneSevenBee.Framework.Euclidean.Vector2();
        }
    },
    constructor: function () {
    },
    getLeft: function () {
        return this.location.x;
    },
    getTop: function () {
        return this.location.y;
    },
    getRight: function () {
        return this.location.x + this.width;
    },
    getBottom: function () {
        return this.location.y + this.height;
    },
    contains$1: function (point) {
        return (point.x >= this.getLeft() && point.x <= this.getRight() && point.y >= this.getTop() && point.y <= this.getBottom());
    },
    contains: function (circle) {
        return (circle.getLeft() >= this.getLeft() && circle.getRight() <= this.getRight() && circle.getTop() >= this.getTop() && circle.getBottom() <= this.getBottom());
    },
    getHashCode: function () {
        var hash = 17;
        hash = hash * 23 + (this.location == null ? 0 : Bridge.getHashCode(this.location));
        hash = hash * 23 + (this.width == null ? 0 : Bridge.getHashCode(this.width));
        hash = hash * 23 + (this.height == null ? 0 : Bridge.getHashCode(this.height));
        return hash;
    },
    equals: function (o) {
        if (!Bridge.is(o,ThreeOneSevenBee.Framework.Euclidean.Rectangle)) {
            return false;
        }
        return Bridge.equals(this.location, o.location) && Bridge.equals(this.width, o.width) && Bridge.equals(this.height, o.height);
    },
    $clone: function (to) {
        var s = to || new ThreeOneSevenBee.Framework.Euclidean.Rectangle();
        s.location = this.location;
        s.width = this.width;
        s.height = this.height;
        return s;
    }
});

/**
 * A basic polygon, represented as a list of points.
 *
 * @public
 * @class ThreeOneSevenBee.Framework.Euclidean.Polygon
 */
Bridge.define('ThreeOneSevenBee.Framework.Euclidean.Polygon', {
    statics: {
        getDefaultValue: function () { return new ThreeOneSevenBee.Framework.Euclidean.Polygon(); }
    },
    points: null,
    constructor: function () {
    },
    getsides: function () {
        return this.points.getCount() - 1;
    },
    contains$1: function (point) {
        throw new Bridge.NotImplementedException();
    },
    contains: function (rectangle) {
        return this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getLeft(), rectangle.getTop()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getRight(), rectangle.getTop()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getRight(), rectangle.getBottom()).$clone()) && this.contains$1(new ThreeOneSevenBee.Framework.Euclidean.Vector2("constructor$1", rectangle.getLeft(), rectangle.getBottom()).$clone());
    },
    getHashCode: function () {
        var hash = 17;
        hash = hash * 23 + (this.points == null ? 0 : Bridge.getHashCode(this.points));
        return hash;
    },
    equals: function (o) {
        if (!Bridge.is(o,ThreeOneSevenBee.Framework.Euclidean.Polygon)) {
            return false;
        }
        return Bridge.equals(this.points, o.points);
    },
    $clone: function (to) {
        var s = to || new ThreeOneSevenBee.Framework.Euclidean.Polygon();
        s.points = this.points;
        return s;
    }
});



Bridge.init();