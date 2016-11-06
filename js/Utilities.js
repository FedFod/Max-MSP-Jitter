Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// - - - 

function print() {
	for (var i = 0; i < arguments.length; i++) {
   		post(arguments[i]);
  	}
	post();
}

// - - -

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}