window.exports = window.exports || {};
window.exports.shaderGlow = window.exports.shaderGlow || {};
window.exports.shaderGlow.fragment = `
varying float intensity;

uniform vec2 iResolution;

void main()
{
  vec2 st = gl_FragCoord.xy/iResolution;
//  float pct = distance(st, vec2(0.2) );
//  float test = step(0.1, pct);

	vec3 glowColor		= vec3( 0.8, 0.5, 0.1 );
//  vec3 glow = glowColor * intensity * test;
  vec3 glow = glowColor * intensity;

  gl_FragColor = vec4( glow, 1.0 );
}
`;
