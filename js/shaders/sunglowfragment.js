window.exports = window.exports || {};
window.exports.shaderGlow = window.exports.shaderGlow || {};
window.exports.shaderGlow.fragment = `
varying vec3 vNormal;

uniform float glowFactor;
uniform float glowPower;
uniform float vNormMultiplier;

void main()
{
//	float intensity = pow( 0.3 - dot( vNormal, vec3( 0.0, 0.0, 0.75 ) ), 1.25 );
  float intensity = pow( glowFactor - dot( vNormal * vNormMultiplier, vec3( 0.0, 0.0, 0.75 ) ), glowPower );
  vec3 orange				= vec3( 0.8, 0.65, 0.3 );
	vec3 orangeGlow		= vec3( 0.8, 0.5, 0.1 );

  gl_FragColor = vec4( orangeGlow, 1.0 ) * intensity;

}
`;
