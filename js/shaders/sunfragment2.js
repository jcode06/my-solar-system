window.exports = window.exports || {};
window.exports.shader = window.exports.shader || {};
window.exports.shader.fragment = `
//	vec3 light = vec3( 0.5, 0.2, 1.0 );
  vec3 light = vec3( 0.9, 0.9, 1.0 );

  light = normalize( light );

  // dProd creates a shadow on part of the object
  float dProd = dot( vNormal, light ) * 0.5 + 0.5;

  vec4 tcolor = texture2D( texture, vUv );
//	vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );
  vec4 gray = vec4( vec3( tcolor.r * 0.4 + tcolor.g * 0.50 + tcolor.b * 0.11 ), 1.0 );

//	gl_FragColor = gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );
  gl_FragColor = gray * vec4( vec3( color ), 1.0 );
`;
