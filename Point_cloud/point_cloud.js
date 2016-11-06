autowatch = 1;

var myWindow = new JitterObject("jit.window", "cloud");
myWindow.floating = 1;
myWindow.size = [600, 600];
myWindow.fsaa = 1;
myWindow.pos = [1000, 100];
myWindow.depthbuffer = 0;
myWindow.sync = 0;

var myRender = new JitterObject("jit.gl.render", "cloud");
myRender.erase_color = [1, 1, 1, 1];

var mySketch = new JitterObject("jit.gl.sketch", "cloud");
mySketch.blend_enable = 1;
mySketch.automatic = 0;
mySketch.color = [0,0,0,0.4];
mySketch.blend = "alphablend";

var noiseMat = new JitterMatrix("noiseMat");

var dim = 10;
declareattribute("dim");
var thresh = 0.1;
declareattribute("thresh");

function drawLines() {
  for(var i = 0; i < dim; i++) {
    var c1 = noiseMat.getcell(i);
    var loc1 = new Vector(c1[0],c1[1],0);
      for(var j = i; j < dim; j++) {
        var c2 = noiseMat.getcell(j);
        var loc2 = new Vector(c2[0],c2[1],0);

        var dist = loc1.distance(loc2);
        if(dist < thresh && dist != 0.000) {
        mySketch.linesegment(loc1.x,loc1.y,0,loc2.x,loc2.y,0);
        }
      }
  }
}

function draw() {
  myRender.erase();

  drawLines();

  mySketch.draw();

  myRender.drawswap();
  mySketch.reset();
}
