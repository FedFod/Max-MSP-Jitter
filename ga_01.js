autowatch = 1;

include("population");

var myWin = new JitterObject("jit.window", "ga_01");
myWin.size = [640, 460];
myWin.pos = [1000, 100];
myWin.floating = 1;
myWin.fsmenubar = 0;
myWin.depthbuffer = 0;
myWin.fsaa = 1;

var myRender = new JitterObject("jit.gl.render", "ga_01");
myRender.erase_color = [1,1,1,1];

var myText = new JitterObject("jit.gl.text", "ga_01");
myText.mode = "2d";
myText.color = [0,0,0,1];
myText.align = 0;
myText.automatic = 0;

draw.immediate = 1;

// ------------------------------------

var target = "to be or not to be";
var popmax = 1000;
var mutationRate = 0.01;
var population;

var start;

function setup() {
  population = new Population(target, mutationRate, popmax);
  start = new Date().getTime();
}

setup();

function draw() {
  population.naturalSelection();
  population.generate();
  population.calcFitness();
  displayInfo();

  if(population.finished()) {
    var end = new Date().getTime();
    print((end - start)/1000);
    outlet(0, "stop");
  }
}

function displayInfo() {
  myRender.erase();
  var answer = population.getBest();
  myText.fontsize = 30;
  myText.position = myRender.screentoworld(20, 30);
  myText.text("Best phrase:");
  myText.draw();
  myText.fontsize = 40;
  myText.position = myRender.screentoworld(20, 100);
  myText.text(answer);
  myText.draw();

  myText.fontsize = 18;
  myText.position = myRender.screentoworld(20, 160);
  myText.text("total generations:     " + population.getGenerations());
  myText.draw();

  myText.position = myRender.screentoworld(20, 180);
  myText.text("average fitness:       " + population.getAverageFitness().toFixed(2));
  myText.draw();

  myText.position = myRender.screentoworld(20, 200);
  myText.text("total population:       " + popmax);
  myText.draw();

  myText.position = myRender.screentoworld(20, 220);
  myText.text("mutation rate:          " + Math.round(mutationRate * 100) + "%");
  myText.draw();

  myText.position = myRender.screentoworld(450, 20);
  myText.text("All phrases:\n" + population.allPhrases());
  myText.draw();

  myRender.drawswap();
}
