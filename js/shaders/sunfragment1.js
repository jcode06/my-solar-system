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
//	float uOff		= ( texSample.g * brightness * 4.5 + time );
	float uOff		= ( texSample.g * brightness * 4.5 - time * 0.5 );

	vec2 starUV		= newUv + vec2( uOff, 0.0 );
//	vec2 starUV		= newUv;

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
//	float brightness2	= brightness;

	vec3 orange				= vec3( 0.8, 0.65, 0.3 );
	vec3 orangeRed		= vec3( 0.8, 0.15, 0.1 );
//	vec3 orangeRed		= vec3( 0.0, 0.0, 1.0 );

	vec2 p 				= -0.5 + vUv;
	float dist		= length(p);

	// create a new uv
	// NOTE: what does -1.0 & 2.0 represent?
	vec2 sp = -1.0 + 2.0 * vUv;
	sp *= ( 2.0 - brightness );

	// r - dot product based on the vUv and a brightness factor
	//	float r = dot(sp,sp);
	// float r = dot( sp,vec2(1.0, 1.0) );

	// f - seems to determine areas of the texture that are darker or lighter
	// vUv in the sp and r variables seems to determine what areas are lighter and darker
	//	float f 			= (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
	//	float f 			= (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;

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


//	if(st.x <= 0.3 ) {
/*
	if(gl_FragCoord.x <= 200.0) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	else {
		gl_FragColor.rgb = baseBrightness;
		gl_FragColor.rgb += starSphere * orange;
		gl_FragColor.rgb += starGlow * orangeRed;
		gl_FragColor.a = 1.0;
	}
*/

} // end main()
`;

/*

float snoise(vec3 uv, float res)	// by trisomie21
{
//	const vec3 s = vec3(1e0, 1e2, 1e4);
	const vec3 s = vec3(1e0, 1e2, 1e4);

	uv *= res;

	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

	vec4 r = fract(sin(v*1e-3)*1e5);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

	return mix(r0, r1, f.z)*2.-1.;
}

float angle		= atan( p.x, p.y )/6.2832;
vec3 coord		= vec3( angle, dist, time * 0.1 );

// NOTE: What is happening in the loop to the fVal2 such that it makes the corona black?
float newTime1	= abs( snoise( coord + vec3( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );
float newTime2	= abs( snoise( coord + vec3( 0.0, -time * ( 0.15 + brightness * 0.001 ), time * 0.015 ), 45.0 ) );
for( int i=1; i<=7; i++ ){
	float power = pow( 2.0, float(i + 1) );
	fVal1 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );
	fVal2 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 25.0 ) * ( newTime2 + 1.0 ) ) );
}

vec2 sp = -1.0 + 2.0 * vUv;
sp *= ( 2.0 - brightness );

// r - dot product based on the vUv and a brightness factor
float r = dot(sp,sp);

// f - seems to determine areas of the texture that are darker or lighter
//	float f = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
//	float f = 1.0 + brightness * 0.5;

// fade is used for the corona
float fade		= pow( length( 2.0 * p ), 0.5 );
float fVal1		= 1.0 - fade;
float fVal2		= 1.0 - fade;

float corona		= pow( fVal1 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
corona				+= pow( fVal2 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
corona				*= 1.2 - newTime1;

float radius		= 0.24 + brightness * 0.2;
float invRadius 	= 1.0/radius;

if( dist < radius ){
	corona			*= pow( dist * invRadius, 24.0 );
	vec2 newUv;
	newUv.x = sp.x*f;
	newUv.y = sp.y*f;
	newUv += vec2( time, 0.0 );

	vec3 texSample 	= texture2D( texture, newUv ).rgb;
	float uOff		= ( texSample.g * brightness * 4.5 + time );
	vec2 starUV		= newUv + vec2( uOff, 0.0 );

	// NOTE: why does the star sphere not encompass an actual sphere?
	starSphere		= texture2D( texture, starUV ).rgb;
}

//	gl_FragColor.rgb	= vec3( f * gray.rgb * ( 0.75 + brightness * 0.3 ) * orange ) + starSphere + corona * orange + starGlow * orangeRed;
//	gl_FragColor.rgb	= vec3( f * gray.rgb * ( 0.75 + brightness * 0.3 ) * orange ) + starSphere * orange + starGlow * orangeRed;

*/
