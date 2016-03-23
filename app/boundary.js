function Boundary(centerPoint, halfx, halfy) {
  this.center = centerPoint;
  this.halfx  = halfx;
  this.halfy  = !_.isUndefined(halfy) ? halfy : halfx;
  this.left   = this.center.x - this.halfx;
  this.right  = this.center.x + this.halfx;
  this.top    = this.center.y - this.halfy;
  this.bottom = this.center.y + this.halfy;
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
  return !(other.left > this.right || other.right < this.left ||
           other.top > this.bottom ||other.bottom < this.top);
};

Boundary.prototype.render = function(options) {
  $('.drawn').remove();
  var boundsClass = (options && options.dragged) ? 'boundary drawn' : 'boundary';
  var $div = $("<div>", {
    id: 'center' + this.center.x,
    class: boundsClass,
    style: getStyle(this)
  });

  $('#main-view').append($div);
};

function getStyle(bounds) {
  var top   = bounds.center.y  - bounds.halfy;
  var left  = bounds.center.x - bounds.halfx;
  var width = bounds.halfx * 2;
  var height = bounds.halfy * 2;
  return 'top: ' + top + 'px' + '; left: ' + left + 'px' + '; width: ' + width + 'px' + '; height: '+ height + 'px';
}
