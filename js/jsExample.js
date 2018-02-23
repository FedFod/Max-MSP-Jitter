autowatch = 1;

var mySketch = new JitterObject("jit.gl.sketch", "jsEx");
mySketch.color = [1,1,1,1];

var ps;
var repeller;

function setup() {
  ps = new ParticleSystem();
  repeller = new Repeller(0,-0.4);
}

function draw() {
  mySketch.reset();

  ps.addParticle();

  var gravity = new Vector(0, -0.0004, 0.0);

  ps.applyForce(gravity);

  ps.applyRepeller(repeller);

  repeller.display();
  ps.run();
}

// Particle System /////////////
function ParticleSystem() {
  this.particles = [];
  this.origin = new Vector(0,0.8,0.0);
}

ParticleSystem.prototype = {

  addParticle: function() {
    var pos = new Vector(this.origin.x, this.origin.y, this.origin.z);
    this.particles.push(new Particle(pos));
  },

  applyForce: function(f) {
    for(var i = 0; i < this.particles.length; i++) {
      this.particles[i].applyForce(f);
    }
  },

  applyRepeller: function(r) {
    for(var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var force = r.repel(p);
      this.particles[i].applyForce(force);
    }
  },

  run: function() {
    for(var i = this.particles.length-1; i >= 0; i--) {
      p = this.particles[i];
      p.run();
      if(p.isDead()) {
        this.particles.splice(i,1);
      }
    }
  }
}

// Particle Class /////////////
function Particle(location)
{
  this.acceleration = new Vector(0.0,0.0,0.0);
  this.velocity = new Vector(random(-0.002, 0.002), random(-0.002,0.0), 0.0);
  this.location = new Vector(location.x,location.y,0);
  this.lifespan = 255.0;
  this.mass = 1.0;
}

Particle.prototype = {

  run: function() {
    this.update();
    this.display();
  },

  applyForce: function(force) {
    var f = new Vector(force.x, force.y, 0.0);
    //f.set(force);
    f.div(this.mass);
    this.acceleration.add(f);
  },

  update: function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0.0);
    this.lifespan -= 2.0;
  },

  display: function() {
    mySketch.moveto(this.location.x, this.location.y, this.location.z);
    var col = this.lifespan/255.0;
    mySketch.glcolor(col,col,col,1);
    mySketch.circle(0.03);
    //print(col)
  },

  isDead: function() {
    if(this.lifespan < 0.0) {
      return 1;
    } else {
      return 0;
    }
  }
}

// Repeller Class ////////////
function Repeller(_x, _y) {
  this.G = 100.0;
  this.location = new Vector(_x, _y);
  this.r = 0.1;
}

Repeller.prototype = {

  display: function() {
    mySketch.glcolor(1.0, 0, 0, 1);
    mySketch.moveto(this.location.x, this.location.y, this.location.z);
    mySketch.circle(this.r);
  },

  repel: function(p) {
    var dir = new Vector(0,0,0);
    dir = this.location.subNew(p.location);
    var d = dir.length();
    d *= 130.0;
    d += 1.0;

    dir.normalize();
    //print(dir.x)

    var force = -1.0 * this.G / (d * d);
    force *= 0.01;
    dir.mult(force);
    return dir;
  }
}
