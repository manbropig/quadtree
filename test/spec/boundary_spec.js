describe('Boundary', function() {
  var boundary1;
  var boundary2;
  var point1 = new Point(100, 100);
  var point2 = new Point(115, 108);
  var point3 = new Point(200, 100);
  var point4 = new Point(205, 100);

  boundary1 = new Boundary(point1, 5);
  boundary2 = new Boundary(point2, 15);
  boundary3 = new Boundary(point3, 5);
  boundary4 = new Boundary(point3, 2, 15);

  it('should render with the correct id', function() {
    boundary1.render();
    boundary2.render();
    boundary3.render();
    boundary4.render();
    expect($('#center100').length).toEqual(1);
  });

  it('should correctly check corner-intersecting boundaries', function() {
    expect(boundary1.intersects(boundary2)).toBeTruthy();
    expect(boundary2.intersects(boundary1)).toBeTruthy();
  });

  it('should correctly check through-intersecting boundaries', function() {
    expect(boundary3.intersects(boundary4)).toBeTruthy();
    expect(boundary4.intersects(boundary3)).toBeTruthy();
  });

  it('should correctly check non intersecting boundaries', function() {
    expect(boundary1.intersects(boundary3)).toBeFalsy();
  });
});
