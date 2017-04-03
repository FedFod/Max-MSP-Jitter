autowatch = 1;
outlets = 5;

var programs = new Dict("shadersDict");
var parD = new Dict("paramsDict.json");
var strV = "";
var strF = "";
var strUniV = "";
var strUniF = "";
var file = new File();
var folder = new Folder();
var path = "";
var filename = "";

var name, desc;

var params = [];
var bindsV = [];
var uniformsV = [];
var bindsF = [];
var uniformsF = [];

function reset(path_, filename_) {
	strUniV = "";
	strUniF = "";
	path = path_;
	filename = filename_;
	params = [];
	bindsV = [];
	uniformsV = [];
	bindsF = [];
	uniformsF = [];
	folder = new Folder(path_);
	strV = "";
	strF = "";
	folder.typelist = [];
	folder.reset();
	var initPrograms = 1;
	while(!folder.end) {
		if(folder.filename == filename_) {initPrograms = 0;}
		folder.next();
	}
	if(initPrograms) {
		initVertexProgram("");
		initFragmentProgram("");
		parD.replace("params", ["%"]);
		parD.replace("bindsV",  ["%"]);
		parD.replace("bindsF",  ["%"]);
		parD.replace("uniformsV",  ["%"]);
		parD.replace("uniformsF",  ["%"]);
		parD.export_json(path+"paramsDict.json");
		params[0] = "%";
		bindsV[0] = "%";
		uniformsV[0] = "%";
		bindsF[0] = "%";
		uniformsF[0] = "%";
		outlet(3, strUniV);
		outlet(4, strUniF);
	} else {
		parD.import_json(path+"paramsDict.json");
		programs.import_json(path +"shadersDict.json");
		for(i=0; i<parD.getsize("params"); i++) {
			params[i] = parD.get("params")[i];
		}
		for(i=0; i<parD.getsize("bindsV"); i++) {
			bindsV[i] = parD.get("bindsV")[i];
		}
		for(i=0; i<parD.getsize("uniformsV"); i++) {
			uniformsV[i] = parD.get("uniformsV")[i];
			if(uniformsV[i] != "%")
				strUniV += uniformsV[i];
		}
		for(i=0; i<parD.getsize("bindsF"); i++) {
			bindsF[i] = parD.get("bindsF")[i];
		}
		for(i=0; i<parD.getsize("uniformsF"); i++) {
			uniformsF[i] = parD.get("uniformsF")[i];
			if(uniformsF[i] != "%")
				strUniF += uniformsF[i];
		}
		strV += programs.get("vertex");
		strF += programs.get("fragment");
		outlet(0, strV);
		outlet(1, strF);
		outlet(3, strUniV);
		outlet(4, strUniF);
	}
	init();
}

function setVar(name_, desc_) {
	name = name_;
	desc = desc_;
}

function initVertexProgram(program) {
	strV = "\n\n";
	strV += "varying vec2 texcoord0;\n";
	strV += "varying vec2 texcoord1;\n";
  strV += "\n\n";
	strV += "void main() {\n";
	strV += "texcoord0 = vec2(gl_TextureMatrix[0] * gl_MultiTexCoord0);\n";
	strV += "texcoord1 = vec2(gl_TextureMatrix[1] * gl_MultiTexCoord1);\n";
	strV += "\n\n";
	strV += "gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\n";
	strV += "}\n\n";
	programs.set("vertex", strV);
	programs.export_json(path+"shadersDict.json")
	outlet(0, strV);
}

function initFragmentProgram(program) {
	strF = "\n\n";
	strF += "varying vec2 texcoord0;\n";
	strF += "varying vec2 texcoord1;\n";
	strF += "\n\n";
	strF += "void main() {\n";
	strF += "\n\n";
	strF += "gl_FragColor = vec4(1,0.4,0.6,1.0);\n";
	strF += "}\n\n";
	programs.set("fragment", strF);
	programs.export_json(path+"shadersDict.json")
	outlet(1, strF);
}

function createFile() {
	file.open();
	var str = "";
	for(k=0; k<200; k++) {
		str += "         \n";
	}
	file.writestring(str);
	file.close();
	str = "";

	file.open();
	str += '<jittershader name = ' + '"' + name + '">\n';
	str += '<description> ' + desc + " </description>\n";
	if(params.length > 0) {
		for(i=0; i<params.length; i++) {
			if(params[i] != "%") {
				str += params[i];
				str += "\n";
			}
		}
	}
	str += '<language name = "glsl" version = "1.2">\n';
	if(params.length > 0) {
		for(i=0; i<bindsV.length; i++) {
			if(bindsV[i] != "%") {
				str += bindsV[i];
				str += "\n";
			}
		}
		for(i=0; i<bindsF.length; i++) {
			if(bindsF[i] != "%") {
				str += bindsF[i];
				str += "\n";
			}
		}
	}
	str += '<program name = "vp" type = "vertex">\n';
	str += "<![CDATA[\n\n";
	str += strUniV;
	str += strV;
	str += "]]>\n";
	str += "</program>\n\n";
	str += '<program name = "fp" type = "fragment">\n';
	str += "<![CDATA[\n\n";
	str += strUniF;
	str += strF;
	str += "]]>\n";
	str += "</program>\n\n";
	str += "</language>\n</jittershader>\n";
	file.writestring(str);
	file.close();
	outlet(2, "bang");
}

function init() {
	file = new File(path+filename, "readwrite", ".jxs");
	createFile();
}

function setVertex(program) {
	programs.set("vertex", program);
	programs.export_json(path+"shadersDict.json");
	strV = program;
	init();
	outlet(0, program);
}

function setFragment(program) {
	programs.set("fragment", program);
	programs.export_json(path+"shadersDict.json")
	strF = program;
	init();
	outlet(1, program);
}

function addParamV(param, bind, uniform) {
	if(checkDup(params, param)) {
		params.unshift(param);
		parD.replace("params", params);
		bindsV.unshift(bind);
		parD.replace("bindsV", bindsV);
		var uni = uniform.replace(/"/g,"");
		uniformsV.unshift("uniform " + uni.split(' ').slice(1,2) + " " + uni.split(' ').slice(0,1)+"; \n");
		parD.replace("uniformsV", uniformsV);
		strUniV = "";
		if(uniformsV.length > 0) {
			for(i=0; i<uniformsV.length; i++) {
				if(uniformsV[i] != "%")
					strUniV += uniformsV[i];
			}
		}
		init();
		parD.export_json(path+"paramsDict.json");
		outlet(3, strUniF);
	}
}

function addParamF(param, bind, uniform) {
	if(checkDup(params, param)) {
		params.unshift(param);
		parD.replace("params", params);
		bindsF.unshift(bind);
		parD.replace("bindsF", bindsF);
		var uni = uniform.replace(/"/g,"");
		uniformsF.unshift("uniform " + uni.split(' ').slice(1,2) + " " + uni.split(' ').slice(0,1)+"; \n");
		parD.replace("uniformsF", uniformsF);
		strUniF = "";
		if(uniformsF.length > 0) {
			for(i=0; i<uniformsF.length; i++) {
				if(uniformsF[i] != "%")
					strUniF += uniformsF[i];
				}
		}
		init();
		parD.export_json(path+"paramsDict.json");
		outlet(4, strUniF);
	}
}

function deleteParamF(param_) {
	var inputParam = '"' + param_ + '"';
	checkParam(params, inputParam);
	parD.replace("params", params);
	//------
	checkParam(bindsF, inputParam);
	parD.replace("bindsF", bindsF);
	//------
	inputParam = param_+";";
	checkParam(uniformsF, inputParam);
	parD.replace("uniformsF", uniformsF);
	strUniF = "";
	if(uniformsF.length > 0) {
		for(i=0; i<uniformsF.length; i++) {
			if(uniformsF[i] != "%")
				strUniF += uniformsF[i];
		}
	}
	parD.export_json(path+"paramsDict.json");
	init();
	outlet(4, strUniF);
}

function deleteParamV(param_) {
	var inputParam = '"' + param_ + '"';
	checkParam(params, inputParam);
	parD.replace("params", params);
	//------
	checkParam(bindsV, inputParam);
	parD.replace("bindsV", bindsV);
	//------
	inputParam = param_+";";
	checkParam(uniformsV, inputParam);
	parD.replace("uniformsV", uniformsV);
	strUniV = "";
	if(uniformsV.length > 0) {
		for(i=0; i<uniformsV.length; i++) {
			if(uniformsV[i] != "%")
				strUniV += uniformsV[i];
		}
	}
	parD.export_json(path+"paramsDict.json");
	init();
	outlet(3, strUniV);
}

function checkParam(arr, input) {
	for(i=0; i<arr.length; i++) {
		var tempArr = arr[i].split(" ");
		var tempAssert = 0;
		for(j=0; j<tempArr.length; j++) {
			if(tempArr[j] == (input)) {
				tempAssert = 1;
			}
		}
		if(tempAssert)
			arr.splice(i, 1);
	}
}

function checkDup(arr, input) {
	var tempAssert = 0;
	for(i=0; i<arr.length; i++) {
		if(arr[i] == (input)) {
			tempAssert = 1;
		}
	}
	if(tempAssert) {
		print("You already have a variable with this name");
		return 0;
	} else { return 1; }
}
