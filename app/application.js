function Boundary(centerPoint, halfx, halfy) {
    this.center = centerPoint;
    this.halfx = halfx;
    this.halfy = !_.isUndefined(halfy) ? halfy : halfx;
    this.left = this.center.x - this.halfx;
    this.right = this.center.x + this.halfx;
    this.top = this.center.y - this.halfy;
    this.bottom = this.center.y + this.halfy;
}

Boundary.prototype.contains = function(point) {
    var px = point.x;
    var py = point.y;
    return px >= this.center.x - this.halfx && px <= this.center.x + this.halfx && py >= this.center.y - this.halfy && py <= this.center.y + this.halfy;
};

Boundary.prototype.intersects = function(other) {
    return !(other.left > this.right || other.right < this.left || other.top > this.bottom || other.bottom < this.top);
};

Boundary.prototype.render = function(options) {
    $(".drawn").remove();
    var boundsClass = options && options.dragged ? "boundary drawn" : "boundary";
    var $div = $("<div>", {
        id: "center" + this.center.x,
        "class": boundsClass,
        style: getStyle(this)
    });
    $("#main-view").append($div);
};

function getStyle(bounds) {
    var top = bounds.center.y - bounds.halfy;
    var left = bounds.center.x - bounds.halfx;
    var width = bounds.halfx * 2;
    var height = bounds.halfy * 2;
    return "top: " + top + "px" + "; left: " + left + "px" + "; width: " + width + "px" + "; height: " + height + "px";
}

var element = $("#main-view");

var cover = $("#cover");

var resetBtn = $(".reseter");

var WIDTH = element.width();

var HEIGHT = element.height();

var plotCount = 500;

var delay = 10;

var halfWidth = element.width() / 2;

var halfHeight = element.height() / 2;

var center = new Point(halfWidth, halfHeight);

var bounds = new Boundary(center, halfWidth);

var root = new QTNode(bounds);

var start = null;

var end = null;

var dragRange = null;

var pointCount = 0;

function insert(x, y) {
    var point = arguments.length === 0 ? generatePoint() : new Point(x, y);
    if (root.insert(point)) {
        setCount(pointCount++);
    }
}

function setCount(count) {
    $("#count").text(pointCount);
}

function reset() {
    pointCount = 0;
    $("#count").text(pointCount);
    $(".boundary, .point").remove();
    root = new QTNode(bounds);
}

function plot(count) {
    var total = 0;
    var interval = setInterval(function() {
        insert();
        total++;
        if (total >= count) {
            clearInterval(interval);
        }
    }, delay);
}

function generatePoint() {
    return new Point(_.random(0, WIDTH), _.random(0, HEIGHT));
}

plot(plotCount);

cover.mousedown(function($event) {
    start = new Point($event.offsetX, $event.offsetY);
});

cover.mouseup(function($event) {
    end = new Point($event.offsetX, $event.offsetY);
    var xLength = end.x - start.x;
    if (xLength > 1) {
        var xmid = (end.x + start.x) / 2;
        var ymid = (end.y + start.y) / 2;
        var halfx = xLength / 2;
        var halfy = (end.y - start.y) / 2;
        var dragBounds = new Boundary(new Point(xmid, ymid), halfx, halfy);
        dragBounds.render({
            dragged: true
        });
        console.log(root.queryRange(dragBounds));
    } else {
        insert($event.offsetX, $event.offsetY);
    }
});

resetBtn.click(reset);

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.render = function() {
    var xVal = this.x - 2;
    var yVal = this.y - 2;
    var $div = $("<div>", {
        id: "x" + this.x + "y" + this.y,
        "class": "point",
        style: "top: " + yVal + "; left: " + xVal
    });
    $("#main-view").append($div);
};

var quadrants = "nw,ne,sw,se".split(",");

function QTNode(bounds) {
    this.capacity = 4;
    this.bounds = bounds;
    this.points = [];
    this.subdivided = false;
}

QTNode.prototype.getBoundsFor = function(bounds, quadrant) {
    var halfLength = bounds.halfx / 2;
    var center = bounds.center;
    var point = {
        nw: function() {
            var x = center.x - halfLength;
            var y = center.y - halfLength;
            return new Point(x, y);
        }(),
        ne: function() {
            var x = center.x + halfLength;
            var y = center.y - halfLength;
            return new Point(x, y);
        }(),
        sw: function() {
            var x = center.x - halfLength;
            var y = center.y + halfLength;
            return new Point(x, y);
        }(),
        se: function() {
            var x = center.x + halfLength;
            var y = center.y + halfLength;
            return new Point(x, y);
        }()
    }[quadrant];
    return new Boundary(point, halfLength);
};

QTNode.prototype.subdivide = function() {
    var _this = this;
    _this.subdivided = true;
    quadrants.forEach(function(quad) {
        var bounds = _this.getBoundsFor(_this.bounds, quad);
        _this[quad] = new QTNode(bounds);
        _this.replacePoints(quad);
        bounds.render();
    });
};

QTNode.prototype.replacePoints = function(quad) {
    var _this = this;
    _this.points.forEach(function(point) {
        if (_this[quad].bounds.contains(point)) {
            _this[quad].insert(point);
        }
    });
    _this.points = _.xor(_this.points, _this[quad].points);
};

QTNode.prototype.insert = function(point) {
    if (!this.bounds.contains(point)) {
        return false;
    }
    if (this.points.length < this.capacity && !this.subdivided) {
        this.points.push(point);
        point.render();
        return true;
    } else if (!this.nw) {
        this.subdivide();
    }
    if (this.nw.insert(point)) {
        return true;
    }
    if (this.ne.insert(point)) {
        return true;
    }
    if (this.sw.insert(point)) {
        return true;
    }
    if (this.se.insert(point)) {
        return true;
    }
    return false;
};

QTNode.prototype.queryRange = function(range) {
    var results = [];
    if (!this.bounds.intersects(range)) {
        return results;
    }
    this.points.forEach(function(point) {
        if (range.contains(point)) {
            results.push(point);
        }
    });
    if (this.nw) {
        var _this = this;
        quadrants.forEach(function(quad) {
            results = results.concat(_this[quad].queryRange(range));
        });
    }
    return results;
};