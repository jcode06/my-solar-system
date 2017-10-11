window.exports = window.exports || {};
window.exports.shaderGlow = window.exports.shaderGlow || {};
window.exports.shaderGlow.vertex = `
varying float intensity;

uniform vec3 viewVector;
uniform float glowFactor;
uniform float glowPower;
uniform float iTime;
uniform sampler2D bumpTexture;
uniform float bumpScale;
uniform float bumpSpeed;

void main()
{
    vec2 vUv = uv;

    // uses the normal, normalMatrix, and viewVector for intensity value used in Fragment shader
    vec3 vNormal = normalize( normalMatrix * normal );
    vec3 vNormal2 = normalize( normalMatrix * viewVector );
    intensity = pow( glowFactor - dot(vNormal, vNormal2), glowPower );

//    vec2 uvTimeShift = vUv + vec2( 1.1, 1.9 ) * iTime * bumpSpeed;
    vec2 uvTimeShift = vUv + vec2( 10.1, 10.9 ) * iTime * bumpSpeed;
    vec4 bumpData = texture2D( bumpTexture, uvTimeShift );

    float displacement = (vUv.y > 0.9 || vUv.y < 0.1) ?
      bumpScale * (0.3 + 0.02 * abs( sin(iTime) ) ) :
      bumpScale * bumpData.r;

    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`;
