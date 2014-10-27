function randomHexColor() {
	var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function sphericalToCart(u, v, L) {
	var vec = new _3.Vector3(L*Math.cos(u)*Math.sin(v), L*Math.sin(u)*Math.sin(v), L*Math.cos(v));
	return vec;
}

function cartToSpherical(pos) {
	var L = Math.sqrt(pos.x*pos.x + pos.y * pos.y + pos.z * pos.z);
	var v = Math.acos (pos.z / L);
	var u = Math.acos (pos.x / (L*Math.sin(v)));
	return new _3.Vector3(u, v, L);
}