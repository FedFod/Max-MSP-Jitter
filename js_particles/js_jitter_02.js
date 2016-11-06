autowatch = 1;

var myWindow = new JitterObject("jit.window", "js");
myWindow.floating = 1;
myWindow.size = [200, 200];
myWindow.fsaa = 1;
myWindow.pos = [1000, 100];
myWindow.depthbuffer = 0;

var myRender = new JitterObject("jit.gl.render", "js");
myRender.erase_color = [1, 1, 1, 0.7];

var mySketch = new JitterObject("jit.gl.sketch", "js");
mySketch.blend_enable = 1;

var Vector = {
	x: 0.0,
	y: 0.0,
	z: 0.0,

	add: function(Vector) {
		this.x += Vector.x;
		this.y += Vector.y;
		this.z += Vector.z;
	}  
};


function Particle() {
	this.location = Object.create(Vector);
	this.velocity = Object.create(Vector);
	this.acceleration = Object.create(Vector);
	this.location.y = 0.7;
	this.acceleration.y = -0.0008;
	this.velocity.x = (Math.random()*2 - 1) / 70.0;
	this.velocity.y = (Math.random()*2 - 1) / 70.0;
	this.lifespan = 255;
}; 

Particle.prototype.update = function() {
	this.velocity.add(this.acceleration);
	this.location.add(this.velocity);
	this.lifespan -= 2;
};

Particle.prototype.display = function() {
	mySketch.moveto(this.location.x, this.location.y, this.location.z);
	var alpha = this.lifespan / 255.0;
	mySketch.glcolor(0.3, 0.3, 0.3, alpha);
	mySketch.circle(0.02);
	mySketch.glcolor(0, 0, 0, alpha);
	mySketch.gllinewidth(2);
	mySketch.framecircle(0.02);
};

Particle.prototype.run = function() {
	this.update();
	this.display();
}

Particle.prototype.isDead = function() {
	if(this.lifespan < 0.0) {
		return true;
	} else {
		return false;
	}
};

// Particles Array
var pArray = [];
var total = 100;

function setup() {
	for(var i = 0; i < total; i++) {
		pArray.push(new Particle());
	}
}

setup();


function draw() {
	
	pArray.push(new Particle());
	pArray.push(new Particle());
	pArray.push(new Particle());

	for(var i = pArray.length-1; i >= 0; i--) {
		pArray[i].run();
		if(pArray[i].isDead()) {
			pArray.splice(i, 1);
		}
	}

	myRender.erase();
	myRender.drawswap();

	mySketch.reset();
}