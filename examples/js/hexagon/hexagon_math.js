/*
Axial coordinates:
  
  /   \   /   \   /   \   /   \
| -1,1  |  0,1  |  1,1  |  2,1  |
|       |       |       |       |
  \   /   \   /   \   /   \   /
    |  -1,0 |  0,0  |  1,0  |
    |       |       |       |
  /   \   /   \   /   \   /   \
| -2,-1 |  -1,-1|  0,-1 |  1,-1 |
|       |       |       |       |
  \   /   \   /   \   /   \   /
    | -2,-2 |  -1,-2|  0,-2 |
    |       |       |       |
     

*/

function Grid()  {
	this.data = {};
	this.set = function(c, hex) {
		this.data[c.x+','+c.y] = hex;
	}

	this.get = function(c) {
		return this.data[c.x+','+c.y];
	}
}

function neighbours(c) {
	return [{x:c.x-1, y:c.y},
	{x:c.x-1, y:c.y-1},
	{x:c.x, y:c.y-1},
	{x:c.x+1, y:c.y},
	{x:c.x+1, y:c.y+1},
	{x:c.x, y:c.y+1}
	]
}

function axialToCarthesian(axial) {
	//return {x: Math.sqrt(3) * (axial.x - axial.y/2), y: 3/2*axial.y};
	return new _3.Vector3(Math.sqrt(3) * (axial.x - axial.y/2), 3/2*axial.y, 0);
}

function pixelToHex(grid, pos, size, camera) {
	var x = pos.x; var y = pos.y;
	var cpos = camera.position;
	var up = new _3.Vector3(0,0,1);

	var width = window.innerWidth; var height = window.innerHeight;

	var dx = (x/width)*2-1;
	var dy = -(y/height)*2+1;

	var sx = new _3.Vector3(); sy = new _3.Vector3();
	sx.crossVectors(up, cpos).normalize()
	sx.multiplyScalar(size.width*dx);
	sy.crossVectors(cpos, sx).normalize()
	if (sy.z < 0) {
		sy.multiplyScalar(-1);
	}
	sy.multiplyScalar(size.height*dy);

	var clickedPoint = new _3.Vector3().addVectors(cpos, sx).add(sy);

	var ratio = (clickedPoint.z - maxHexHeight) / cpos.z;
	var projectedPoint = new _3.Vector3(clickedPoint.x - ratio*cpos.x, clickedPoint.y - ratio*cpos.y, maxHexHeight/2);

	var intersectionHexes = []; 
	console.log(projectedPoint);

	for (coord in g.data) {
		var bbox = new _3.Box3().setFromObject(g.data[coord].object);
		if (bbox.containsPoint(projectedPoint)) {

			intersectionHexes.push(g.data[coord]);
		}
	}

	var closestHex = _.min(intersectionHexes, function(hex) {
		return projectedPoint.distanceToSquared(hex.object.position);
	})

	return closestHex;




}

function spread(s, depth) {
	spreads = spread_rec([JSON.stringify(s)], depth);
	return spreads.map(function(json) {
		return JSON.parse(json);
	});

}

function spread_rec(s, depth) {

	if (depth > 0) {
		var slength = s.length
		for (i = 0; i < slength; i++) {
			
			n = neighbours(JSON.parse(s[i]));
			for (j = 0; j < n.length; j++) {
				n_json = JSON.stringify(n[j]);
				if (s.indexOf(n_json) == -1) {
					s.push(n_json);
				}
			}
		}
		s = spread_rec(s, depth-1);
	}
	return s;
}