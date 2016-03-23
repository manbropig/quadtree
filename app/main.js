var element    = $('#main-view');
var cover      = $('#cover');
var resetBtn   = $('.reseter');

var WIDTH      = element.width();
var HEIGHT     = element.height();
var plotCount  = 500;
var delay      = 10; //ms

var halfWidth  = element.width() / 2;
var halfHeight = element.height() / 2;
var center     = new Point(halfWidth, halfHeight);
var bounds     = new Boundary(center, halfWidth);
var root       = new QTNode(bounds);

var start      = null;
var end        = null;
var dragRange  = null;
var pointCount = 0;

function insert(x, y) {
  var point = arguments.length === 0 ? generatePoint() : new Point(x, y);
  if (root.insert(point)) {
    setCount(pointCount++);
  }
}

function setCount(count) {
  $('#count').text(pointCount);
}

function reset() {
  pointCount = 0;
  $('#count').text(pointCount);
  $('.boundary, .point').remove();
  root = new QTNode(bounds);
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

// plot(plotCount);

cover.mousedown(function($event) {
  start = new Point($event.offsetX, $event.offsetY);
});

cover.mouseup(function($event) {
  end = new Point($event.offsetX, $event.offsetY);
  var xLength = end.x - start.x;
  if (xLength > 1) {
    var xmid  = (end.x + start.x) / 2;
    var ymid  = (end.y + start.y) / 2;
    var halfx = xLength / 2;
    var halfy = (end.y - start.y) / 2;
    var dragBounds = new Boundary(new Point(xmid, ymid), halfx, halfy);
    dragBounds.render({dragged: true});
    console.log(root.queryRange(dragBounds));
  } else {
    insert($event.offsetX, $event.offsetY);
  }
});

resetBtn.click(reset);
