( (SolarLib, THREE, dat, exports) => {
  "use strict";

// textures courtesy of James Hastings-Trew via website links below
// http://planetpixelemporium.com/index.php
// http://planetpixelemporium.com/planets.html
// Purely for educational, non-commercial use in this instance

window.addEventListener("load", init, false);

var scene, camera, renderer, controls; // global vars needed throughout the program

var width = window.innerWidth;
var height = window.innerHeight;
var aspectRatio = width / height;

var sun, sunGlow;
var planets = new Map();
var orbits = new Map();

var clock;
var sunUniforms, glowUniforms, sunDisplacement, sunNoise;
var sunControls, glowControls;

function init() {
  clock = new THREE.Clock();

  // TEXTURES
  var textureLoader       = new THREE.TextureLoader();
  var textureFlare0       = textureLoader.load( "assets/lensflare0.png");
  var textureFlare2       = textureLoader.load( "assets/lensflare2.png");
  var textureSun          = textureLoader.load( "assets/sunmap.jpg" );
  var textureSun2         = textureLoader.load( "assets/sunTexture.jpg" );
  var textureEarth        = textureLoader.load( "assets/earthmap1k.jpg" );
  var textureMercury      = textureLoader.load( "assets/mercurymap.jpg" );
  var textureVenus        = textureLoader.load( "assets/venusmap.jpg" );
  var textureMars         = textureLoader.load( "assets/mars_1k_color.jpg" );
  var textureJupiter      = textureLoader.load( "assets/jupitermap.jpg" );
  var textureSaturn       = textureLoader.load( "assets/saturnmap.jpg" );
  var textureUranus       = textureLoader.load( "assets/uranusmap.jpg" );
  var textureNeptune      = textureLoader.load( "assets/neptunemap.jpg" );
  var texturePluto        = textureLoader.load( "assets/plutomap1k.jpg" );

  var textureSaturnRings  = textureLoader.load( "assets/saturnringcolor.jpg" );
//  var textureUranusRings  = textureLoader.load( "assets/uranusringcolour.jpg" );
  var textureUranusRings  = textureLoader.load( "assets/uranusringtrans.gif" );

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.02 );

  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, aspectRatio, 5, 500000);
  camera.position.y = 735;
  camera.position.z = 2935;

//  var helper = new THREE.CameraHelper( camera );
//  scene.add( helper );

  // LIGHTS
  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x999999, 0.2);
  scene.add(hemisphereLight);

  var pointLight = new THREE.PointLight(0xffffff, 1.0, 0, 1);
  pointLight.position.set(0, 0, 0);
//  pointLight.castShadow = true;

  scene.add(pointLight);

//  var helper = new THREE.CameraHelper( pointLight.shadow.camera );
//  scene.add( helper );

  window.addEventListener( 'resize', onWindowResize, false );

  // create our solar objects as the textures get loaded
  // size the system in relation to earth and the sun
  var sunSize   = 300;
  var earthSize = 20; // 2.29
  var earthOrbit = 4 * sunSize;
  var earthSpeed = 1; // lower number = faster, higher number = slower
  var earthRotateSpeed = 1;
  var lineSegments = 360;

  glowUniforms = {
    glowFactor: { value: 0.3 },
    glowPower: { value: 1.25 },
    vNormMultiplier: { value: 1.0 },
    viewVector: { type: "v3", value: camera.position },
    iTime: { value: 0.1 },
    bumpTexture: { value: textureSun2 },
    bumpScale: { value: 40.0 },
    bumpSpeed: { value: 1.5 },
    iResolution: { value: new THREE.Vector2(width, height) }
  }

  var glowMaterial = new THREE.ShaderMaterial({
    uniforms: glowUniforms,
    vertexShader:   exports.shaderGlow.vertex,
    fragmentShader: exports.shaderGlow.fragment,
    side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
  });

  sunUniforms = {
    amplitude: { value: 1.0 },
//    texture: { value: textureSun },
    texture: { value: textureSun2 },
    sphereTexture: { value: textureSun2 },
    iTime: { value: 0.1 },
    brightnessMultiplier: { value: 7.0 },
    iResolution: { value: new THREE.Vector2(width, height) }
  }
  sunUniforms.texture.value.wrapS = sunUniforms.texture.value.wrapT = THREE.RepeatWrapping;

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: sunUniforms,
    vertexShader: exports.shader.vertex,
    fragmentShader: exports.shader.fragment
  });

  var sunGeometry = new THREE.SphereBufferGeometry(sunSize, 64, 64),

  sunDisplacement = new Float32Array( sunGeometry.attributes.position.count );
  sunNoise        = new Float32Array( sunGeometry.attributes.position.count );

  for( let i=0; i < sunDisplacement.length; i++) {
    sunNoise[i] = Math.random() * 5;
  }
  sunGeometry.addAttribute('displacement', new THREE.BufferAttribute(sunDisplacement, 1) );

  sun = new THREE.Mesh(
          sunGeometry,
          shaderMaterial
  );
  sun.name = "Sun";
  pointLight.add(sun);

  var ballGeometry = new THREE.SphereGeometry( sunSize + 250, 32, 16 );
	sunGlow = new THREE.Mesh( ballGeometry, glowMaterial );
  sunGlow.name = "SunGlow";
  pointLight.add(sunGlow);

  // create orbit sizes
  orbits.set("Mercury", new SolarLib.Orbit({ name: "Mercury", orbitSize: earthOrbit * .57 }) );
  orbits.set("Venus", new SolarLib.Orbit({ name: "Venus", orbitSize: earthOrbit * .72 }) );
  orbits.set("Earth", new SolarLib.Orbit({ name: "Earth", orbitSize: earthOrbit  }) );
  orbits.set("Mars", new SolarLib.Orbit({ name: "Mars", orbitSize: earthOrbit * 1.52 }) );

  // Farther orbits shorter to bring the planets a bit closer together
  orbits.set("Jupiter", new SolarLib.Orbit({ name: "Jupiter", orbitSize: earthOrbit * 3.5 }) );
  orbits.set("Saturn", new SolarLib.Orbit({ name: "Saturn", orbitSize: earthOrbit * 6.5 }) );
  orbits.set("Uranus", new SolarLib.Orbit({ name: "Uranus", orbitSize: earthOrbit * 13.0 }) );
  orbits.set("Neptune", new SolarLib.Orbit({ name: "Neptune", orbitSize: earthOrbit * 20.0 }) );
  orbits.set("Pluto", new SolarLib.Orbit({ name: "Pluto", orbitSize: earthOrbit * 25.0 }) );

  orbits.forEach( (orbit, key, map) => {
    var curObject = orbit.draw();
    scene.add(curObject);
  });

  // Planet creation
  planets.set("Mercury", new SolarLib.Planet({
    name: "Mercury", texture: textureMercury,
    orbit: orbits.get("Mercury").orbitSize, speed: earthSpeed * .4,
    radius: earthSize * .38, rotateSpeed: earthRotateSpeed * 0.1,
    color: 0xffffff,
    x: 0, y:0, z:0
  }));

  planets.set("Venus", new SolarLib.Planet({
    name: "Venus", texture: textureVenus,
    orbit: orbits.get("Venus").orbitSize, speed: earthSpeed * .6,
    radius: earthSize * .95,
    color: 0xffffff, rotateSpeed: earthRotateSpeed * 0.2,
    x: 0, y:0, z:0
  }));

  planets.set("Earth", new SolarLib.Planet({
    name: "Earth", texture: textureEarth,
    orbit: orbits.get("Earth").orbitSize, speed: earthSpeed,
    radius: earthSize, rotateSpeed: earthRotateSpeed,
    color: 0x2194ce,
    x: 0, y:0, z:0
  }));

  planets.set("Mars", new SolarLib.Planet({
    name: "Mars", texture: textureMars,
    orbit: orbits.get("Mars").orbitSize, speed: earthSpeed * 1.2,
    radius: earthSize * .53, rotateSpeed: earthRotateSpeed * 0.975,
    color: 0xffffff,
    x: 0, y:0, z:0
  }));

  planets.set("Jupiter", new SolarLib.Planet({
    name: "Jupiter", texture: textureJupiter,
    orbit: orbits.get("Jupiter").orbitSize, speed: earthSpeed * 1.4,
    radius: earthSize * 11.20,
    color: 0xffffff, rotateSpeed: earthRotateSpeed * 2.43,
    x: 0, y:0, z:0
  }));

  planets.set("Saturn", new SolarLib.PlanetWithRings({
    name: "Saturn", texture: textureSaturn,
    ringsTexture: textureSaturnRings, ringAngle: 90,
    ringDistance: earthSize * 2.0, ringSize: earthSize * 6.00,
    orbit: orbits.get("Saturn").orbitSize, speed: earthSpeed * 1.5,
    radius: earthSize * 9.45, rotateSpeed: earthRotateSpeed * 2.35,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Uranus", new SolarLib.PlanetWithRings({
    name: "Uranus", texture: textureUranus,
    ringsTexture: textureUranusRings, ringAngle: 0,
    ringDistance: earthSize * 1.5, ringSize: earthSize * 2.00,
    orbit: orbits.get("Uranus").orbitSize, speed: earthSpeed * 2.0,
    radius: earthSize * 4.00, rotateSpeed: earthRotateSpeed * 1.34,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Neptune", new SolarLib.Planet({
    name: "Neptune", texture: textureNeptune,
    orbit: orbits.get("Neptune").orbitSize, speed: earthSpeed * 2.5,
    radius: earthSize * 3.88, rotateSpeed: earthRotateSpeed * 1.25,
    color: 0xffffff,
    x: 0, y:0, z:0
  }));

  planets.set("Pluto", new SolarLib.Planet({
    name: "Pluto", texture: texturePluto,
    orbit: orbits.get("Pluto").orbitSize, speed: earthSpeed * 3.0,
    radius: earthSize * 0.19, rotateSpeed: earthRotateSpeed * 0.3,
    color: 0xffffff,
    x: 0, y:0, z:0
  }));

  // Create Planets
  planets.forEach( (planet, key, map) => {
    var curObject = planet.create(scene);
    scene.add(curObject);
  });

  // Create Stars
  var StarsObj = new SolarLib.Stars({ spreadMultiplier: 2000 });
  var stars = StarsObj.create();
  for(let starInst of stars) {
    scene.add(starInst);
  }

/*
  // Fly Controls, currently not working
	controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 1000;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
*/

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  setupGui();

  animate();


// START FUNCTION DEFINITIONS ------------------------------------------------------

  function setupGui() {
    // initialize the guiControls
    sunControls = {
      amplitude: 8.0,
      displacement: 0,
      noise: 1.0,
      timeFactor: -0.15,
      brightness: 8.0,
    }
    glowControls = {
      glowFactor: 0.28,
      glowPower: 7.33,
      glowTimeFactor: 1.5,
      vNormMultiplier: 1.0,
      size: 1,
      bumpScale: 61.0,
      bumpSpeed: 0.60
    }

    var gui = new dat.GUI();
    var folder = gui.addFolder("Sun Controls");

    folder.add(sunControls, "amplitude", 0.0, 100.0, 0.1).name("Amplitude").listen();
    folder.add(sunControls, "displacement", 0.0, 360.0, 1.0).name("Displacement").listen();
    folder.add(sunControls, "noise", -15.0, 15.0, 0.1).name("Noise").listen();
    folder.add(sunControls, "timeFactor", -5.0, 5.0, 0.05).name("Rotation");
    folder.add(sunControls, "brightness", -20.0, 20.0, 0.1).name("Brightness");

    var folder = gui.addFolder("Sun Glow Controls");

    folder.add(glowControls, "glowFactor", 0.0, 3.0, 0.01).name("Spread");
    folder.add(glowControls, "glowPower", 0.01, 10.0, 0.01).name("Intensity");
    folder.add(glowControls, "vNormMultiplier", 0.01, 5.0, 0.01).name("V Norm Multiplier");
    folder.add(glowControls, "glowTimeFactor", -5.0, 25.0, 0.5).name("Time Factor");
    folder.add(glowControls, "size", 0.5, 5, 0.01).name("Size");
    folder.add(glowControls, "bumpScale", -5.0, 100.0, 0.5).name("Corona Size");
    folder.add(glowControls, "bumpSpeed", 0.01, 20.0, 0.01).name("Corona Speed");
  }

  function animate() {
    requestAnimationFrame( animate );

    controls.update();

    var time = Date.now() * .01;

    _animateSun(time);

    planets.forEach( (planet, key, map) => {
      planet.update(time);
    });

    renderer.render( scene, camera );

    // HELPERS ----------------------------------------------------------

    function _animateSun(curTime) {
      if(sun != undefined) {
        var rotationRadians = curTime * Math.PI/180;
        var timeRadians = curTime*5 * Math.PI/180

        sunUniforms.iTime.value += clock.getDelta() * sunControls.timeFactor;
        sunUniforms.brightnessMultiplier.value = sunControls.brightness;

        glowUniforms.glowFactor.value = glowControls.glowFactor;
        glowUniforms.glowPower.value = glowControls.glowPower;
        glowUniforms.vNormMultiplier.value = glowControls.vNormMultiplier;

        glowUniforms.bumpScale.value = glowControls.bumpScale;
        glowUniforms.bumpSpeed.value = glowControls.bumpSpeed;

        // Amplitude controls the amount of fuzziness in the border, as well as
        // rotation within the vertex
        sunUniforms.amplitude.value = sunControls.amplitude * Math.sin( timeRadians * 0.125 );

        var displacementRadians = sunControls.displacement * Math.PI/180;

        for ( var i = 0; i < sunDisplacement.length; i ++ ) {

//    				sunDisplacement[ i ] = (Math.sin(5.0 * i + Date.now() * Math.PI/180 ) + 5.5) / 2;
//    				sunDisplacement[ i ] = Math.sin( 5.0 * i + curTime );
/*
            // -0.25 to 0.25
   				  sunNoise[ i ] += 0.5 * ( 0.5 - Math.random() );
    				sunNoise[ i ] = THREE.Math.clamp( sunNoise[ i ], -2, 15 );

    				sunDisplacement[ i ] += sunNoise[ i ];
*/
//            sunDisplacement[ i ] = Math.sin( displacementRadians * i );


//            sunNoise[ i ] += 0.02 * ( 0.5 - Math.random() );
//            sunDisplacement[ i ] += sunNoise[ i ];
//            sunDisplacement[ i ] += guiControls.noise * Math.max( (Math.random() / 2 + 0.5), 0.2);
  			}

  			sun.geometry.attributes.displacement.needsUpdate = true;

        sun.matrixAutoUpdate = false;
//        sun.matrix.makeRotationY(rotationRadians);

      }

      if(sunGlow != undefined) {
        sunGlow.scale.set(glowControls.size, glowControls.size, glowControls.size);

        var subVector = new THREE.Vector3().subVectors( camera.position, sunGlow.position );

        glowUniforms.viewVector.value = subVector;
        glowUniforms.iTime.value += clock.getDelta() * glowControls.glowTimeFactor;
      }

    } // end _sunAnimate()

  } // end animate()


  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    glowUniforms.iResolution.value = new THREE.Vector2(width, height);
    sunUniforms.iResolution.value = new THREE.Vector2(width, height);

    renderer.setSize( window.innerWidth, window.innerHeight );

  } // onWindowResize

} // end init



} )(window.SolarLib, THREE, dat, window.exports);
