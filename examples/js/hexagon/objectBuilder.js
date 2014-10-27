var _3 = THREE;

ObjectBuilder = function(collada) {
	this.collada = collada;

	this.meshes={
		Hexagon : 	collada.getObjectByName('Hexagon').children[0].geometry,
		Connector:  collada.getObjectByName('Connector_1').children[0].geometry,
		Hub: collada.getObjectByName('Central_connector').children[0].geometry
	};
	this.materials = {
		Hexagon : 	collada.getObjectByName('Hexagon').children[0].material,
		Connector:  collada.getObjectByName('Connector_1').children[0].material,
		Hub: collada.getObjectByName('Central_connector').children[0].material
	};

	// post-loading init
	this.materials.Hexagon.bumpScale = 0.05;
}

ObjectBuilder.prototype = {
	constructor: ObjectBuilder,


	Object: function(mesh) {
		var object = new _3.Object3D();
		object.add(mesh);
		object.name = mesh.name.replace("_mesh","");
		return object;
	},
	Hexagon: function() {
		var mesh = new _3.Mesh(this.meshes.Hexagon.clone(), this.materials.Hexagon);
		mesh.name="hexagon_mesh";
		return this.Object(mesh);
	},

	Connector: function() {
		var mesh = new _3.Mesh(this.meshes.Connector.clone(), this.materials.Connector);
		mesh.name = "connector_mesh";
		return this.Object(mesh);
	},

	Hub: function() {
		var mesh = new _3.Mesh(this.meshes.Hub.clone(), this.materials.Hub);
		mesh.name = "hub_mesh";
		return this.Object(mesh);
	}
}