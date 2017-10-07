( (THREE) => {
  "use strict";

// textures courtesy of James Hastings-Trew via website links below
// http://planetpixelemporium.com/index.php
// http://planetpixelemporium.com/planets.html
// Purely for educational, non-commercial use in this instance

window.addEventListener("load", init, false);

var scene, camera, renderer, controls; // global vars needed throughout the program
var cube, sphere;
var sun, earth;
var planets = new Map();
var orbits = new Map();
var width = window.innerWidth;
var height = window.innerHeight;
var aspectRatio = width / height;
var count = 0;

function init() {
  // TEXTURES
  var textureLoader       = new THREE.TextureLoader();
  var textureFlare0       = textureLoader.load( "assets/lensflare0.png");
  var textureFlare2       = textureLoader.load( "assets/lensflare2.png");
  var textureSun          = textureLoader.load( "assets/sunmap.jpg" );
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
//  scene.background = new THREE.Color().setHSL( 0.75, 0.65, 0.04 );

  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, aspectRatio, 5, 500000);
  camera.position.y = 50;
  camera.position.z = 1000;

//  var helper = new THREE.CameraHelper( camera );
//  scene.add( helper );

  // LIGHTS
  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x999999, 0.2);
  scene.add(hemisphereLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8, 0, 1);
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
  var earthSpeed = 10; // lower number = faster, higher number = slower
  var earthRotateSpeed = 1;
  var lineSegments = 360;

  sun = new THREE.Mesh(
          new THREE.SphereGeometry(sunSize, 64, 64),
    //      new THREE.SphereGeometry(100, 64, 64),
          new THREE.MeshPhongMaterial( { emissive: 0xffa100, emissiveIntensity: 0.9, emissiveMap: textureSun, color: 0xa36c00 })
//          new THREE.MeshPhongMaterial( { emissive: 0xFDFFA7, emissiveIntensity: 0.2, emissiveMap: textureSun, color: 0xFDFFA7 })
    //    new THREE.MeshBasicMaterial( { map: textureSun, color: 0xFDFFA7 })
                  );
  pointLight.add(sun);

  orbits.set("Mercury", earthOrbit * .57);
  orbits.set("Venus", earthOrbit * .72);
  orbits.set("Earth", earthOrbit);
  orbits.set("Mars", earthOrbit * 1.52);

  // Farther orbits shorter to bring the planets a bit closer together
  orbits.set("Jupiter", earthOrbit * 3.5);
  orbits.set("Saturn", earthOrbit * 6.5);
  orbits.set("Uranus", earthOrbit * 13.0);
  orbits.set("Neptune", earthOrbit * 20.0);
  orbits.set("Pluto", earthOrbit * 25.0);

/*
  orbits.set("Mercury", earthOrbit * .38);
  orbits.set("Venus", earthOrbit * .72);
  orbits.set("Earth", earthOrbit);
  orbits.set("Mars", earthOrbit * 1.52);

  orbits.set("Jupiter", earthOrbit * 5.20);
  orbits.set("Saturn", earthOrbit * 9.53);
  orbits.set("Uranus", earthOrbit * 19.18);
  orbits.set("Neptune", earthOrbit * 30.04);
  orbits.set("Pluto", earthOrbit * 39.51);
*/

  drawOrbit(orbits.get("Mercury"), lineSegments);
  drawOrbit(orbits.get("Venus"), lineSegments);
  drawOrbit(orbits.get("Earth"), lineSegments);
  drawOrbit(orbits.get("Mars"), lineSegments);
  drawOrbit(orbits.get("Jupiter"), lineSegments);
  drawOrbit(orbits.get("Saturn"), lineSegments);
  drawOrbit(orbits.get("Uranus"), lineSegments);
  drawOrbit(orbits.get("Neptune"), lineSegments);
  drawOrbit(orbits.get("Pluto"), lineSegments);

  createPlanet({
    name: "Mercury", texture: textureMercury,
    orbit: orbits.get("Mercury"), speed: earthSpeed * .4,
    radius: earthSize * .38, rotateSpeed: earthRotateSpeed * 0.1,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Venus", texture: textureVenus,
    orbit: orbits.get("Venus"), speed: earthSpeed * .6,
    radius: earthSize * .95,
    color: 0xffffff, rotateSpeed: earthRotateSpeed * 0.2,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Earth", texture: textureEarth,
    orbit: orbits.get("Earth"), speed: earthSpeed,
    radius: earthSize, rotateSpeed: earthRotateSpeed,
    color: 0x2194ce,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Mars", texture: textureMars,
    orbit: orbits.get("Mars"), speed: earthSpeed * 1.2,
    radius: earthSize * .53, rotateSpeed: earthRotateSpeed * 0.975,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Jupiter", texture: textureJupiter,
    orbit: orbits.get("Jupiter"), speed: earthSpeed * 1.4,
    radius: earthSize * 11.20,
    color: 0xffffff, rotateSpeed: earthRotateSpeed * 2.43,
    x: 0, y:0, z:0
  });

  createPlanetWithRings({
    name: "Saturn", texture: textureSaturn,
    ringsTexture: textureSaturnRings, ringAngle: 90,
    ringDistance: earthSize * 2.0, ringSize: earthSize * 6.00,
    orbit: orbits.get("Saturn"), speed: earthSpeed * 1.5,
    radius: earthSize * 9.45, rotateSpeed: earthRotateSpeed * 2.35,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createPlanetWithRings({
    name: "Uranus", texture: textureUranus,
    ringsTexture: textureUranusRings, ringAngle: 0,
    ringDistance: earthSize * 1.5, ringSize: earthSize * 2.00,
    orbit: orbits.get("Uranus"), speed: earthSpeed * 2.0,
    radius: earthSize * 4.00, rotateSpeed: earthRotateSpeed * 1.34,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Neptune", texture: textureNeptune,
    orbit: orbits.get("Neptune"), speed: earthSpeed * 2.5,
    radius: earthSize * 3.88, rotateSpeed: earthRotateSpeed * 1.25,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createPlanet({
    name: "Pluto", texture: texturePluto,
    orbit: orbits.get("Pluto"), speed: earthSpeed * 3.0,
    radius: earthSize * 0.19, rotateSpeed: earthRotateSpeed * 0.3,
    color: 0xffffff,
    x: 0, y:0, z:0
  });

  createStars();

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
  animate();


// START FUNCTION DEFINITIONS ------------------------------------------------------

  function drawOrbit(radius = 200, segments = 360) {
    var material = new THREE.LineBasicMaterial({ color:0xffffff });
    var geometry = new THREE.Geometry();

    for(let i=0; i <= segments; i++) {
      var theta = i/segments * Math.PI * 2;
      geometry.vertices.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
      );
    }

    scene.add( new THREE.Line(geometry, material) );
  }

  // creates geometry for the planet, and adds it to the list of planets
  function createPlanet(params) {
    var geometry  = new THREE.SphereGeometry(params.radius, 32, 32);
    var material  = new THREE.MeshLambertMaterial( { map: params.texture, color: params.color });
    var mesh      = new THREE.Mesh( geometry, material );
    mesh.name     = params.name + "Mesh";
    var planet    = new THREE.Group();

//    mesh.castShadow = false;
//    mesh.receiveShadow = true;

    planet.add(mesh);
    scene.add(planet);

    // set planet properties
    for(let key in params) {
      if( ["name", "orbit", "speed", "rotateSpeed",
        "ringAngle", "ringDistance", "ringSize"].includes(key) ) {
        planet[key] = params[key];
      }
    }
    planet.position.set(params.x, params.y, params.z);

    planets.set(params.name, planet);

    return planet;
  }

  function createPlanetWithRings(params) {
    var planet = createPlanet(params);

    var phiSegments = 64;
    var thetaSegments = 64;
    var innerRadius = params.radius + params.ringDistance;
    var outerRadius = params.radius + params.ringDistance + params.ringSize;

    var geometry = new THREE.RingGeometryV2(innerRadius, outerRadius, thetaSegments, phiSegments);

    // add rings here
    var newMesh  = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial( { map: params.ringsTexture, color: params.color, side: THREE.DoubleSide })
//      new THREE.MeshBasicMaterial( { map: params.ringsTexture, color: params.color, side: THREE.DoubleSide })
    );

    // rotate the ring over
    var rotationRadians = planet.ringAngle * Math.PI/180;
    var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
    newMesh.matrixAutoUpdate = false;
    newMesh.applyMatrix(rotation);

//    newMesh.castShadow = true;
//    newMesh.receiveShadow = true;

    planet.add(newMesh);

    return planet;
  }

  function createStars() {
    var stars1 = 50; // 250
    var stars2 = 375; // 1500

    var i, r = 2000, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
    for ( i = 0; i < stars1; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 0 ].vertices.push( vertex );
    }
    for ( i = 0; i < stars2; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 1 ].vertices.push( vertex );
    }
    var stars;
    var starsMaterials = [
      new THREE.PointsMaterial( { color: 0xdddddd, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0xdddddd, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0xaaaaaa, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x7a7a7a, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x5a5a5a, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x5a5a5a, size: 1, sizeAttenuation: false } )

/*
      new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
*/
    ];
    for ( i = 10; i < 30; i ++ ) {
      stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
      stars.rotation.x = Math.random() * 6;
      stars.rotation.y = Math.random() * 6;
      stars.rotation.z = Math.random() * 6;
      stars.scale.setScalar( i * 10 );
      stars.matrixAutoUpdate = false;
      stars.updateMatrix();
      scene.add( stars );
    }
  }

  function animate() {
    requestAnimationFrame( animate );

    controls.update();

    var count = Date.now() * .05;

    _sunAnimate();

    planets.forEach( (value, key, map) => {
      _animatePlanet(value);
    });

    renderer.render( scene, camera );

    // HELPERS ----------------------------------------------------------

    function _sunAnimate() {
      if(sun != undefined) {
        var radians = count/5 * Math.PI/180;

        sun.matrixAutoUpdate = false;
        sun.matrix.makeRotationY(radians);
      }
    } // end _sunAnimate()

    function _animatePlanet(planet) {
      if(planet != undefined) {
        var orbitSize = planet.orbit;

        var planetMesh = planet.getObjectByName(planet.name + "Mesh");

        var rotationRadians = planet.rotateSpeed * Math.PI/180;
        var xRadians = count/planet.speed * Math.PI/180;
        var zRadians = (count/planet.speed + 90) * Math.PI/180;

        // rotation needs to be fixed, it's a little off
        var rotation;
        if(planet.name == "Uranus") {
          rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
        }
        else if(planet.name == "Venus") {
          rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), -rotationRadians);
        }
        else {
          rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotationRadians);
        }

//orbitSize /= 10;
//xRadians = 1;
//zRadians = 1;

        var x = (Math.sin(xRadians) * orbitSize);
        var y = 0;
        var z = (Math.sin(zRadians) * orbitSize);

        planet.matrixAutoUpdate = false;
        planet.matrix.makeTranslation( x, y, z );

        if(planetMesh != undefined) {
          planetMesh.matrixAutoUpdate = false;
          planetMesh.applyMatrix(rotation);
        }
      }
    } // end _animatePlanet()
  } // end animate()


  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  } // onWindowResize

} // end init



} )(THREE);
