function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.render = function() {
  var $div = $("<div>", {
    id: 'x' + this.x + 'y' + this.y,
    class: 'point',
    style: 'top: ' + this.y + '; left: ' + this.x
  });

  $('#main-view').append($div);
};
