function Boundary(centerPoint, halfDimension) {
  this.center = centerPoint;
  this.half   = halfDimension;
}

Boundary.prototype.contains = function(point) {
  var px = point.x;
  var py = point.y;
  return (px >= (this.center.x - this.half) &&
          px <= (this.center.x + this.half) &&
          py >= (this.center.y - this.half) &&
          py <= (this.center.y + this.half));
};

Boundary.prototype.intersects = function(other) {
  var _this = this;
  var boundsArray = [_this, other].sort(function(a, b) {
    return getArea(a) >= getArea(b) ? -1 : 1;
  });

  var larger  = _.first(boundsArray);
  var smaller = _.last(boundsArray);

  var smallCorners = getCorners(smaller);
  var contained = _.filter(smallCorners, function(corner) {
    return larger.contains(corner);
  });
  return !!contained.length;
};

Boundary.prototype.render = function() {
  var $div = $("<div>", {
    id: 'center' + this.center.x,
    class: 'boundary',
    style: getStyle(this)
  });

  $('#main-view').append($div);
};

function getArea(bounds) {
  var corners = getCorners(bounds);
  return (corners.ne - corners.nw) * (corners.sw - corners.nw);
}

function getCorners(bounds) {
  return {
    nw: new Point(bounds.center.x - bounds.half, bounds.center.y - bounds.half),
    ne: new Point(bounds.center.x + bounds.half, bounds.center.y - bounds.half),
    sw: new Point(bounds.center.x - bounds.half, bounds.center.y + bounds.half),
    se: new Point(bounds.center.x + bounds.half, bounds.center.y + bounds.half)
  };
}

function getStyle(bounds) {
  var top   = bounds.center.y  - bounds.half;
  var left  = bounds.center.x - bounds.half;
  var width = bounds.half * 2;
  return 'top: ' + top + 'px' + '; left: ' + left + 'px' + '; width: ' + width + 'px' + '; height: '+ width + 'px';
}
