function Boundary(centerPoint, halfDimension) {
  this.center = centerPoint;
  this.half   = halfDimension;
}

Boundary.prototype.contains = function(point) {
  var px = point.x;
  var py = point.y;
  return (px > (this.center.x - this.half) &&
          px < (this.center.x + this.half) &&
          py > (this.center.y - this.half) &&
          py < (this.center.y + this.half));
};

Boundary.prototype.render = function() {
  var $div = $("<div>", {
    id: 'center: ' + this.center.x,
    class: 'boundary',
    style: getStyle(this)
  });

  $('#main-view').append($div);
};

function getStyle(bounds) {
  var top   = bounds.center.y  - bounds.half;
  var left  = bounds.center.x - bounds.half;
  var width = bounds.half * 2;
  return 'top: ' + top + '; left: ' + left + '; width: ' + width + '; height: '+ width;
}
