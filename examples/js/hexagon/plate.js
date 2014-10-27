Plate = function(x, y) {
	this.object = objectBuilder.Hexagon();
	this.object.position.copy(axialToCarthesian({x:x, y:y}));

	this.object.add(objectBuilder.Hub());

	this.connectors = [];
}

Plate.prototype.addConnector = function(c)  {
	var connector = new Connector(c);

	this.connectors.push(connector);
	this.object.add(connector.object);
}

Plate.prototype.addFlash = function(c, direction, flash) {
	var connector =_(this.connectors)
		.find(function(connector) { return connector.c == c});

	if (connector) {
		if (direction == 'in') {
			var m = connector.object.getObjectByName("connector_mesh");
			var o = new _3.Object3D();
			var pl = new _3.PointLight(0xeeeeff, 2,1);
			var pl2 = new _3.PointLightHelper(pl, 1);

			o.add(pl);
			o.add(pl2);
			//m.add(o);
			scene.add(o);
			o.position.set(0,0,maxHexHeight+.1);
			//scene.add(o);
			console.log(connector.object.getObjectByName("connector_mesh"));
		}

	}

}


Connector = function(c) {
	this.object = objectBuilder.Connector();
	this.object.rotation.set(0,0,Math.PI/3*c);

	this.c = c;
}

Connector.prototype.setRotation = function(c) {
	this.object.rotation.set(0,0,Math.PI/3*c);
	this.c = c;
}