window.exports = window.exports || {};
window.exports.shaderGlow = window.exports.shaderGlow || {};
window.exports.shaderGlow.fragment = `
varying float intensity;

void main()
{
	vec3 glowColor		= vec3( 0.8, 0.5, 0.1 );
  vec3 glow = glowColor * intensity;

  gl_FragColor = vec4( glow, 1.0 );
}
`;
