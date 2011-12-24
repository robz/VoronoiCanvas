var initSize = {width:2000,height:1000};
var canvasSize = {width:initSize.width,height:initSize.height};
var capitals;
var mids;

function init() {
	capitals = makeRandomPoints(2);
	mids = getMidPoints(capitals);
	setBoundLinePoints(mids);

	paintPallet();
	window.onresize = paintPallet;
	document.getElementById("pallet").onclick = addPoint;
}

function paintPallet(e) {
	var canvas=document.getElementById("pallet");
	var browserSize = getSize();
	canvasSize.width = browserSize.width*2/3;
	canvasSize.height = browserSize.height*2/3;
	canvas.width = canvasSize.width;
	canvas.height = canvasSize.height;
	
	if(!canvas.getContext){return;}
	var ctx = canvas.getContext("2d");
	drawPoints(capitals,ctx);
	drawBoundLines(ctx,mids);
	drawPoints(mids,ctx);
}

function addPoint(e) {
	capitals.push({x:e.offsetX*initSize.width/canvasSize.width,
		y:e.offsetY*initSize.height/canvasSize.height});
	mids = getMidPoints(capitals);
	setBoundLinePoints(mids);
	paintPallet();
}

function makeRandomPoints(numPoints) {
	var points = new Array();
	for(var i = 0; i < numPoints; i++) 
		points[i] = getRandomCoords(initSize);
	return points;
}

function drawPoints(points,ctx) {
	ctx.beginPath();
	ctx.lineWidth = 3;
	
	for(var i = 0; i < points.length; i++) {
		ctx.moveTo(points[i].x*canvasSize.width/initSize.width,
			points[i].y*canvasSize.height/initSize.height);
		ctx.lineTo(points[i].x*canvasSize.width/initSize.width,
			points[i].y*canvasSize.height/initSize.height+3);
	}
	ctx.stroke();
}

function getRandomCoords(size) {
	return { x:(Math.floor(Math.random()*(size.width+1))),
		y:(Math.floor(Math.random()*(size.height+1))) };
}

function drawBoundLines(ctx, mids) {
	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 1;
	for(var i = 0; i < mids.length; i++) {
		ctx.moveTo(mids[i].boundPoints[0].x*canvasSize.width/initSize.width,
			mids[i].boundPoints[0].y*canvasSize.height/initSize.height);
		ctx.lineTo(mids[i].boundPoints[1].x*canvasSize.width/initSize.width,
			mids[i].boundPoints[1].y*canvasSize.height/initSize.height);
	}
	ctx.stroke();
}

// Edge case fail: if a line hits a corner perfectly...
function setBoundLinePoints(mids) {
	for(var i = 0; i < mids.length; i++) {
		var mid = mids[i];
		var theta = (Math.PI/2+
			getTheta(mid.p2.x-mid.p1.x,
				mid.p2.y-mid.p1.y))%(Math.PI*2);
		var bound = {x:-mid.x,y:-mid.y};
		var boundPoints = [
			{x:initSize.width,y:Math.floor(mid.y+(bound.x+initSize.width)*Math.tan(theta))},
			{x:0,y:Math.floor(mid.y+(bound.x)*Math.tan(theta))},
			{x:Math.floor(mid.x+(bound.y+initSize.height)/Math.tan(theta)),y:initSize.height},
			{x:Math.floor(mid.x+(bound.y)/Math.tan(theta)),y:0}
		];
		var k = 0;
		mid.boundPoints = new Array();
		for(var j = 0; j < 4; j++) {
			if (boundPoints[j].x >= 0 && boundPoints[j].y >= 0 &&
				boundPoints[j].x <= initSize.width && boundPoints[j].y <= initSize.height) {
				mid.boundPoints.push(boundPoints[j]);
				k++;
			}
			if (k == 2) break;
		}
	}
}

function testGetTheta() {
	var coords = [[2,0],[2,1],[1,2],[0,2],[-1,2],[-2,1],[-2,0],[-2,-1],[-1,-2],
			[0,-2],[1,-2],[2,-1]];
			
	for(var i = 0; i < coords.length; i++) {
		var coord = coords[i];
		console.log(coord[0]+","+coord[1]+"\t"+
			getTheta(coord[0],coord[1])+","+
			Math.cos(getTheta(coord[0],coord[1]))+","+
			Math.sin(getTheta(coord[0],coord[1])));
	}
}

function getTheta(x,y) {
	var theta = Math.atan(y/x);
	if (x == 0 && y == 0)
		theta = 0;
	else if (x < 0)
		theta += Math.PI;
	else if (x >= 0 && y < 0) 
		theta += 2*Math.PI;
	return theta;
}

function getMidPoints(points) {
	var mids = new Array();
	for(var i = 0; i < points.length-1; i++) {
		for(var j = i+1; j < points.length; j++) {
			var p1 = points[i], p2 = points[j];
			mid = {x:p1.x+(p2.x-p1.x)/2,y:p1.y+(p2.y-p1.y)/2,p1:p1,p2:p2};
			mids.push(mid);
		}
	}
	return mids;
}