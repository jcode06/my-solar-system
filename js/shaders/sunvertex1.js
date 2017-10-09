window.exports = window.exports || {};
window.exports.shader = window.exports.shader || {};
window.exports.shader.vertex = `


uniform float amplitude;

attribute float displacement;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

	vNormal = normalize( normalMatrix * vNormal );

	// this seems to affect the rotation of the texture
//	vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

	vUv = uv; // leaving uv alone for now

	// displacement creates the spiky animation on the surface
	vec3 newPosition = position + amplitude * normal * vec3( displacement );
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

`;
