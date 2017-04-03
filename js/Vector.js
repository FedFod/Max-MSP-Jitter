
// Vector class
function Vector(x, y, z) {

	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
};

Vector.prototype = {

	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},

	addNew: function(v) {
		var aX = this.x + v.x;
		var aY = this.y + v.y;
		var aZ = this.z + v.z;

		return new Vector(aX, aY, aZ);
	},

	sub: function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
	},

	subNew: function(v) {
		var sX = this.x - v.x;
		var sY = this.y - v.y;
		var sZ = this.z - v.z;

		return new Vector(sX, sY, sZ);
	},

	mult: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
	},

	multNew: function(scalar) {
		var mX = this.x * scalar;
		var mY = this.y * scalar;
		var mZ = this.z * scalar;

		return new Vector(mX, mY, mZ);
	},

	div: function(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
	},

	divNew: function(scalar) {
		var dX = this.x / scalar;
		var dY = this.y / scalar;
		var dZ = this.z / scalar;

		return new Vector(dX, dY, dZ);
	},

	rotate: function(angle) {

		var temp = new Vector(this.x, this.y);

		this.x = (temp.x * Math.cos(angle)) - (temp.y * Math.sin(angle));
		this.y = (temp.x * Math.sin(angle)) + (temp.y * Math.cos(angle));
	},

	length: function() {
		return Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
	},

	normalize: function() {
		var m = this.length();

		this.x = this.x/m;
		this.y = this.y/m;
		this.z = this.z/m;
	},

	distance: function(v) {
		return Math.sqrt((v.x-this.x)*(v.x-this.x) + (v.y-this.y)*(v.y-this.y) + (v.z-this.z)*(v.z-this.z));
	},

	get: function() {
		return new Vector(this.x, this.y, this.z);
	},

	set : function(x, y, z){
      		if (x instanceof Vector) { return this.set(x.x, x.y, x.z); }
          if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    		this.x = x || 0;
     		this.y = y || 0;
     		this.z = z || 0;
  }
};

// - - -
