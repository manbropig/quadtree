var element    = $('#main-view');
var cover      = $('#cover');
var WIDTH      = element.width();
var HEIGHT     = element.height();
var plotCount  = 500;
var delay      = 10; //ms

var halfWidth  = element.width() / 2;
var halfHeight = element.height() / 2;
var center     = new Point(halfWidth, halfHeight);
var bounds     = new Boundary(center, halfWidth);
var root       = new QTNode(bounds);

insert(10, 10);

function insert(x, y) {
  var point = arguments.length === 0 ? generatePoint() : new Point(x, y);
  root.insert(point);
}

function plot(count) {
  var total = 0;
  var interval = setInterval(function() {
    insert();
    total++;
    if(total >= count) {
      clearInterval(interval);
    }
  }, delay);
}

function generatePoint() {
  return new Point(_.random(0, WIDTH), _.random(0, HEIGHT));
}

plot(plotCount);

cover.click(function($event) {
  console.log($event.offsetX, $event.offsetY);
  insert($event.offsetX, $event.offsetY);
});
