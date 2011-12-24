var shapes = {points:new Array()};
var path = {points:new Array()};

function printPoints(outputElemName) {
	var str = "check this out:";
	for(var i = 0; i < shapes.points.length; i++) 
		str += "<br/>"+shapes.points[i].x+"\t"+shapes.points[i].y;
	document.getElementById(outputElemName).innerHTML = str;
}

function printPath(outputElemName) {
	var str = "check this out:";
	for(var i = 0; i < path.points.length; i++) 
		str += "<br/>"+path.points[i].x+"\t"+path.points[i].y;
	document.getElementById(outputElemName).innerHTML = str;
}

function makeRandomPoints(numPoints) {
	for(var i = 0; i < numPoints; i++) 
		shapes.points[i] = getRandomCoords(initSize);
	return shapes.points;
}

function makeRandomPath(numPoints) {
	for(var i = 0; i < numPoints; i++) 
		path.points[i] = getRandomCoords(initSize);
}

function drawPoints(ctx) {
	ctx.beginPath();
	ctx.lineWidth = 3;
	
	for(var i = 0; i < shapes.points.length; i++) {
		ctx.moveTo(shapes.points[i].x*canvasSize.width/initSize.width,
			shapes.points[i].y*canvasSize.height/initSize.height);
		ctx.lineTo(shapes.points[i].x*canvasSize.width/initSize.width,
			shapes.points[i].y*canvasSize.height/initSize.height+3);
	}
	ctx.stroke();
	
	return shapes.points;
}

function drawPath(palletName) {
	var canvas=document.getElementById(palletName);
	if(!canvas.getContext){return;}
	var ctx=canvas.getContext("2d");
	
	ctx.beginPath();
	ctx.moveTo(path.points[0].x*canvasSize.width/initSize.width,
		path.points[0].y*canvasSize.height/initSize.height);
	for(var i = 1; i < path.points.length; i++) 
		ctx.lineTo(path.points[i].x*canvasSize.width/initSize.width,
			path.points[i].y*canvasSize.height/initSize.height);
	ctx.stroke();
}

function getRandomCoords(size) {
	return { x:(Math.floor(Math.random()*(size.width+1))),
		y:(Math.floor(Math.random()*(size.height+1))) };
}