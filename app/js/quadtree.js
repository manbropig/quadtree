  var quadrants = 'nw,ne,sw,se'.split(',');

  function QTNode(bounds) {
    this.capacity   = 4;
    this.bounds     = bounds;
    this.points     = [];
    this.subdivided = false;
  }

  QTNode.prototype.getBoundsFor = function(bounds, quadrant) {
    var halfLength = bounds.halfx / 2;
    var center = bounds.center;
    var point = {
      nw: (function() {
        var x = center.x - halfLength;
        var y = center.y - halfLength;
        return new Point(x, y);
      })(),
      ne: (function() {
        var x = center.x + halfLength;
        var y = center.y - halfLength;
        return new Point(x, y);
      })(),
      sw: (function() {
        var x = center.x - halfLength;
        var y = center.y + halfLength;
        return new Point(x, y);
      })(),
      se: (function() {
        var x = center.x + halfLength;
        var y = center.y + halfLength;
        return new Point(x, y);
      })()
    }[quadrant];
    return new Boundary(point, halfLength);
  };

  QTNode.prototype.subdivide = function() {
    //split node into 4 and place points where they belong
    var _this = this;
    _this.subdivided = true;
    quadrants.forEach(function(quad) {
      var bounds  = _this.getBoundsFor(_this.bounds, quad);
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
    //find the node the point belongs in
    if (!this.bounds.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity && !this.subdivided) {
      this.points.push(point);
      point.render();
      return true;
    }
    else if (!this.nw) {
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
