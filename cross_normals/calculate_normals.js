var normMat = new JitterMatrix("normals");
var vertMat = new JitterMatrix("vertices");

var myHandle = new JitterObject("jit.gl.handle", "w20");

var mySketch = new JitterObject("jit.gl.sketch", "w20");
mySketch.color = [1, 0, 0, 1];

function calculateNormals() {
	mySketch.position = myHandle.position;
	mySketch.rotatexyz = myHandle.rotatexyz; 
	outlet(0, "position "+myHandle.position);
	outlet(0, "rotatexyz "+myHandle.rotatexyz);
	mySketch.reset();
	for(i = 0; i<normMat.dim[0]; i++) {
		for(j = 0; j<normMat.dim[1]; j++) {
			var norm = normMat.getcell(i,j);
			norm[0] *= 0.5;
			norm[1] *= 0.5;
			norm[2] *= 0.5;
			var vert = vertMat.getcell(i,j);
			mySketch.linesegment(vert[0], vert[1], vert[2],vert[0]+norm[0],vert[1]+norm[1],vert[2]+norm[2]);
		}
	}
}