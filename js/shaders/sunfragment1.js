window.exports = window.exports || {};
window.exports.shader = window.exports.shader || {};
window.exports.shader.fragment = `

// Adapted from flight404's Shader Toy: https://www.shadertoy.com/view/4dXGR4
// Which is based on trisomie21's Shader Toy: https://www.shadertoy.com/view/lsf3RH
// And made to work with three.js and spherical objects

varying vec3 vNormal;
varying vec2 vUv;

// supplied by the program
uniform sampler2D texture;
uniform sampler2D sphereTexture;
uniform float iTime;
uniform float brightnessMultiplier;
uniform vec2 iResolution;

float getStarGlow(float dist, float brightness) {
	return min( max( 1.0 - dist * ( 1.0 - brightness ), 0.0 ), 1.0 );
}

// time rotates the uv map and animates it
// set time to 0 to eliminate the rotation
vec3 getStarSphere(vec2 sp, float f, float time, float brightness, sampler2D texture) {
	vec2 newUv;
	newUv.x = sp.x*f;
	newUv.y = sp.y*f;
	newUv += vec2( time * 0.2, 0.0 );

	vec3 texSample 	= texture2D( texture, newUv ).rgb;

	// uOff adds the glow,
	// time rotates the glow
	float uOff		= ( texSample.g * brightness * 4.5 - time * 0.5 );

	vec2 starUV		= newUv + vec2( uOff, 0.0 );

	// NOTE: why does the star sphere not encompass an actual sphere?
	return texture2D( texture, starUV ).rgb;
}

void main() {

	float freqs[4];
	freqs[0] = texture2D( texture, vec2( 0.01, 0.25 ) ).x;
	freqs[1] = texture2D( texture, vec2( 0.07, 0.25 ) ).x;
	freqs[2] = texture2D( texture, vec2( 0.15, 0.25 ) ).x;
	freqs[3] = texture2D( texture, vec2( 0.30, 0.25 ) ).x;

	float time		= iTime;

	float brightness	= freqs[1] * 0.25 + freqs[2] * 0.25 ;
	float brightness2	= freqs[1] * 0.001 + freqs[2] * 0.001;

	vec3 orange				= vec3( 0.8, 0.65, 0.3 );
	vec3 orangeRed		= vec3( 0.8, 0.15, 0.1 );

	vec2 p 				= -0.5 + vUv;
	float dist		= length(p);

	// create a new uv
	// NOTE: what does -1.0 & 2.0 represent?
	vec2 sp = -1.0 + 2.0 * vUv;
	sp *= ( 2.0 - brightness );

	// r - dot product based on the vUv and a brightness factor

	// f - seems to determine areas of the texture that are darker or lighter
	// vUv in the sp and r variables seems to determine what areas are lighter and darker

  float f 			= 0.25 + brightness * 0.5; // this works for our purpose

	// baseBrightness
	vec3 baseBrightness = vec3( f * ( 0.75 + brightness * brightnessMultiplier ) * orange );

	// starSphere adds the textured lighting, and rotation
	vec3 starSphere		= getStarSphere(sp, f, time, brightness, sphereTexture);

	// starGlow adds the orange glow
	float starGlow 		= getStarGlow(dist, brightness2);

	// Break down fragment color creation by steps
	// 1. Start with a base brightness for the orange
	// 2. Add in the star sphere
	// 3. Add in the star glow
	vec2 st = gl_FragCoord.xy/iResolution;

	gl_FragColor.rgb = baseBrightness;
	gl_FragColor.rgb += starSphere * orange;
	gl_FragColor.rgb += starGlow * orangeRed;
	gl_FragColor.a = 1.0;

} // end main()
`;
