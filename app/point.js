function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.render = function() {
  var xVal = this.x - 2;
  var yVal = this.y - 2;
  var $div = $("<div>", {
    id: 'x' + this.x + 'y' + this.y,
    class: 'point',
    style: 'top: ' + yVal + '; left: ' + xVal
  });

  $('#main-view').append($div);
};

Point.prototype.toString = function() {
  return this.x + ', ' + this.y;
}
