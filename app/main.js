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

var dragStart  = null;
var dragEnd    = null;
var dragRange  = null;

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

function setDragBounds(start, end) {
  var xmid  = (end.x + start.x) / 2;
  var ymid  = (end.y + start.y) / 2;
  var halfx = (end.x - start.x) / 2;
  var halfy = (end.y - start.y) / 2;
  var dragBounds = new Boundary(new Point(xmid, ymid), halfx, halfy);
  console.log(root.queryRange(dragBounds));
}

plot(plotCount);

cover.click(function($event) {
  insert($event.offsetX, $event.offsetY);
});

cover.mousedown(function($event) {
  dragStart = new Point($event.offsetX, $event.offsetY);
});

cover.mouseup(function($event) {
  dragEnd = new Point($event.offsetX, $event.offsetY);
  setDragBounds(dragStart, dragEnd);
});
