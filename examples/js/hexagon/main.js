/**
 * 
 */

var container = document.getElementById('container');
var stats;

var _3=THREE;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var RATIO = SCREEN_WIDTH/SCREEN_HEIGHT;
var SIZE = 10;

scene = new _3.Scene();

var camera = new _3.OrthographicCamera( -SIZE*RATIO, SIZE*RATIO, SIZE, -SIZE, 0.1, 200);
camera.position.x = -5;
camera.position.y = 0;
camera.position.z = 5;
camera.lookAt(new _3.Vector3(0,0,0));
camera.up = new _3.Vector3(0,0,1);

var loader = new _3.ColladaLoader();

var g;

var hex_count = 0;
var pointLight;

var objectBuilder;
loader.load('models/collada/hexagon/base_hexagon2.dae', function(collada) {
	dae = collada.scene;


	objectBuilder  = new ObjectBuilder(dae);

	scene.add(dae.getObjectByName('Lamp'));

	createNewHexagon = function(x, y) {
		var plate = new Plate(x, y);
		var cs = _([0,1,2,3,4,5]).sample(2);

		plate.addConnector(cs[0]);
		plate.addConnector(cs[1]);

		var object = plate.object;


		plate.onclick = function() {
			this.connectors.forEach(function(connector) {
				var c = (connector.c + 1) % 6;
				connector.setRotation(c);
			})
			console.log(this);
		}
		return plate;
	}

	g = new Grid();
	f = spread({x:0,y:0},3);

	f.forEach(function(pos) {
		var plate = createNewHexagon(pos.x, pos.y);
		g.set(pos, plate);

		scene.add(plate.object);
/*		plate.connectors.forEach(function(connector) {
			scene.add(connector.object);
		})
*/
		plate.object.getObjectByName("hexagon_mesh").geometry.computeBoundingBox();
		maxHexHeight = plate.object.getObjectByName("hexagon_mesh").geometry.boundingBox.max.z;
	});

	pointLight = new _3.PointLight(0xeeeeff, 2,1);
	pointLight.position.set(0,0,maxHexHeight+.1);
	scene.add(pointLight);

});


var renderer = new _3.WebGLRenderer({antialias:true});

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

stats = new Stats();
stats.domElement.style.position='absolute';
stats.domElement.style.top = '0px';
container.appendChild(stats.domElement);

container.onclick = function(e) {
	var clickedHex = pixelToHex(g, {x: e.offsetX- container.offsetTop, y: e.offsetY-container.offsetLeft}, {width: SIZE*RATIO,
		height:SIZE}, camera);

	clickedHex.onclick();

}

var camera_alpha;
var camera_beta;

var camera_alpha_init;
var camera_beta_init;

var camera_dist;

var moving_camera = false;

container.onmousedown = function(e) {
	if (e.button == 1) {
		initX = e.offsetX; initY = e.offsetY;
		var uvL = cartToSpherical({x: camera.position.x, y: camera.position.y, z: camera.position.z});

		var xyzTemp  = sphericalToCart(uvL.x, uvL.y, uvL.z);
		var diffTemp = xyzTemp.sub(camera.position);
		if (diffTemp.length() > .1) {
			uvL.x = 2*Math.PI - uvL.x;
		}
		console.log(uvL);

		camera_alpha = camera_alpha_init = uvL.x;
		camera_beta = camera_beta_init = uvL.y;
		camera_dist = uvL.z;

		moving_camera = true;
		e.stopPropagation();
	}
}

container.onmousemove = function(e) {
	if (e.button == 1) {
		e.stopPropagation();

		camera_alpha = camera_alpha_init +  (e.offsetX - initX)/100;
		camera_beta = Math.max (0.01, Math.min(Math.PI/2-.01, camera_beta_init +  (e.offsetY - initY)/100));

		pos = sphericalToCart(camera_alpha, camera_beta, camera_dist);

		camera.position.set(pos.x, pos.y, pos.z);
		camera.lookAt(new _3.Vector3(0,0,0));


	}
}


/*container.onmousewheel = function (e) {

	var uvL = cartToSpherical({x: camera.position.x, y: camera.position.y, z: camera.position.z});

	var xyzTemp  = sphericalToCart(uvL.x, uvL.y, uvL.z);
	var diffTemp = xyzTemp.sub(camera.position);
	if (diffTemp.length() > .1) {
		uvL.x = 2*Math.PI - uvL.x;
	}
	console.log(uvL);

	camera_alpha = camera_alpha_init = uvL.x;
	camera_beta = camera_beta_init = uvL.y;
	camera_dist = uvL.z;

	camera_dist = Math.max(1, camera_dist - Math.sign(e.wheelDelta) * 0.1);
	pos = sphericalToCart(camera_alpha, camera_beta, camera_dist);

	camera.position.set(pos.x, pos.y, pos.z);
	camera.lookAt(new _3.Vector3(0,0,0));
}*/

function render() {
		requestAnimationFrame(render);
		animate();
		writeConsole();
		stats.update();

		renderer.render(scene, camera);
}

var theta = 0;
var lookingAt;

function animate() {
	lookingAt = new _3.Vector3(0,0,0)
	
//	camera.position.set(5*Math.sin(theta), -5*Math.cos(theta), 5);
	camera.lookAt(lookingAt);

	//camera.position.set(0,Math.cos(theta),Math.sin(theta));
	//camera.updateProjectionMatrix();
	/*theta += 0.001;
	if (theta > 2* Math.PI) {
		theta = theta - 2*Math.PI;
	}

*/	//if (pointLight && pointLight.position) {
	//	pointLight.position.setX (pointLight.position.x + Math.random()*.2-.1);
	//	pointLight.position.setY (pointLight.position.y + Math.random()*.2-.1);
	//}

}

function writeConsole() {
	var xconsole = document.getElementById('console');
	xconsole.innerHTML =
		'theta: ' + theta +'<br>' +
		'camera.lookAt: (' + lookingAt.x.toFixed(3) + ',' + lookingAt.y.toFixed(3) + ',' + lookingAt.z.toFixed(3)	+ ')<br>' +
		'camera position: (' + camera.position.x.toFixed(3) + ',' + camera.position.y.toFixed(3) + ',' + camera.position.z.toFixed(3) +')<br>' +
		'camera rotation: (' + camera.rotation.x.toFixed(3) + ',' + camera.rotation.y.toFixed(3) + ',' + camera.rotation.z.toFixed(3) +')';
}

render();



