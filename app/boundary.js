function Boundary(centerPoint, halfx, halfy) {
  this.center = centerPoint;
  this.halfx   = halfx;
  this.halfy  = !_.isUndefined(halfy) ? halfy : halfx;
}

Boundary.prototype.contains = function(point) {
  var px = point.x;
  var py = point.y;
  return (px >= (this.center.x - this.halfx) &&
          px <= (this.center.x + this.halfx) &&
          py >= (this.center.y - this.halfy) &&
          py <= (this.center.y + this.halfy));
};

Boundary.prototype.intersects = function(other) {
  var _this = this;
  var boundsArray = [_this, other].sort(function(a, b) {
    return getArea(a) >= getArea(b) ? 1 : -1;
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
    nw: new Point(bounds.center.x - bounds.halfx, bounds.center.y - bounds.halfy),
    ne: new Point(bounds.center.x + bounds.halfx, bounds.center.y - bounds.halfy),
    sw: new Point(bounds.center.x - bounds.halfx, bounds.center.y + bounds.halfy),
    se: new Point(bounds.center.x + bounds.halfx, bounds.center.y + bounds.halfy)
  };
}

function getStyle(bounds) {
  var top   = bounds.center.y  - bounds.halfy;
  var left  = bounds.center.x - bounds.halfx;
  var width = bounds.halfx * 2;
  return 'top: ' + top + 'px' + '; left: ' + left + 'px' + '; width: ' + width + 'px' + '; height: '+ width + 'px';
}
