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
var width = window.innerWidth;
var height = window.innerHeight;
var aspectRatio = width / height;
var count = 0;

function init() {
  var textureLoader     = new THREE.TextureLoader();
  var textureFlare0     = textureLoader.load( "assets/lensflare0.png");
  var textureFlare2     = textureLoader.load( "assets/lensflare2.png");
  var textureSun        = textureLoader.load( "assets/sunmap.jpg" );
  var textureEarth      = textureLoader.load( "assets/earthmap1k.jpg" );
  var textureMercury    = textureLoader.load( "assets/mercurymap.jpg" );
  var textureVenus      = textureLoader.load( "assets/venusmap.jpg" );
  var textureMars       = textureLoader.load( "assets/mars_1k_color.jpg" );
  var textureJupiter    = textureLoader.load( "assets/jupitermap.jpg" );
  var textureSaturn     = textureLoader.load( "assets/saturnmap.jpg" );
  var textureUranus     = textureLoader.load( "assets/uranusmap.jpg" );
  var textureNeptune    = textureLoader.load( "assets/neptunemap.jpg" );
  var texturePluto      = textureLoader.load( "assets/plutomap1k.jpg" );

  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.02 );

  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000);
  camera.position.y = 50;
  camera.position.z = 400;

/*
  addLight( 0.55, 0.9, 0.5, 0, 0, 0 );

  function addLight( h, s, l, x, y, z ) {

    var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );
    scene.add( light );

    var flareColor = new THREE.Color( 0xffffff );
    flareColor.setHSL( h, s, l + 0.5 );

    var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

    lensFlare.position.copy( light.position );

    scene.add( lensFlare );

  }
*/


  var pointLight = new THREE.PointLight(0xffffff, 1.2, 0, 1);
  //  pointLight.position.set(sun.position);

  // create our solar objects as the textures get loaded
  sun           = new THREE.Mesh(
                    new THREE.SphereGeometry(50, 64, 64),
                    new THREE.MeshPhongMaterial( { emissive: 0xFDFFA7, emissiveIntensity: 0.8, emissiveMap: textureSun, color: 0xFDFFA7 })
//                    new THREE.MeshBasicMaterial( { map: textureSun, color: 0xFDFFA7 })
                  );
//  scene.add(sun);

  pointLight.add(sun);
  scene.add(pointLight);

  // https://www.universetoday.com/36649/planets-in-order-of-size/
  var earthSize = 10;

  planets.set("Mercury",  createPlanet({
    name: "Mercury", texture: textureMercury,
    orbit: 150, speed: 1, radius: earthSize * .38,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Venus",  createPlanet({
    name: "Venus", texture: textureVenus,
    orbit: 300, speed: 2, radius: earthSize * .95,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Earth",  createPlanet({
    name: "Earth", texture: textureEarth,
    orbit: 500, speed: 3, radius: earthSize,
    color: 0x2194ce,
    x: 0, y:0, z:0
  }) );

  planets.set("Mars",  createPlanet({
    name: "Mars", texture: textureJupiter,
    orbit: 750, speed: 4, radius: earthSize * .53,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Jupiter",  createPlanet({
    name: "Jupiter", texture: textureJupiter,
    orbit: 1000, speed: 5, radius: earthSize * 11.20,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Saturn",  createPlanetWithRings({
    name: "Saturn", texture: textureSaturn,
    orbit: 1250, speed: 5.5, radius: earthSize * 9.45,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Uranus",  createPlanetWithRings({
    name: "Uranus", texture: textureUranus,
    orbit: 1500, speed: 8, radius: earthSize * 4.00,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Neptune",  createPlanet({
    name: "Neptune", texture: textureNeptune,
    orbit: 1750, speed: 10, radius: earthSize * 3.88,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  planets.set("Pluto",  createPlanet({
    name: "Pluto", texture: texturePluto,
    orbit: 2000, speed: 15, radius: earthSize * 0.19,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );


/*
  var lightSphere = new THREE.SphereGeometry( 20, 16, 8 );

  var spotLight = new THREE.SpotLight( 0xffffff, 1, 100, Math.PI/2, 1, 0 );
  spotLight.add( new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  spotLight.position.set( 75, 75, 0 );
  scene.add(spotLight);
*/


  createStars();


  var ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.2);
  scene.add(ambientLight);


  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );


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


//  function createPlanet(name, texture, color, radius, x, y, z) {
  function createPlanet(params) {
    var geometry  = new THREE.SphereGeometry(params.radius, 32, 32);
    var material  = new THREE.MeshLambertMaterial( { map: params.texture, color: params.color });
    var mesh      = new THREE.Mesh( geometry, material );
    mesh.name     = params.name + "Mesh";
    var planet    = new THREE.Group();
    planet.add(mesh);
    scene.add(planet);
    planet.name = params.name;
    planet.size = params.radius;
    planet.orbit = params.orbit;
    planet.speed = params.speed;
    planet.rotateSpeed = params.rotateSpeed || 0.5;

    planet.position.set(params.x, params.y, params.z);

    return planet;
  }

  function createPlanetWithRings(params) {
    var planet = createPlanet(params);

    // add rings here

    return planet;
  }

  function createStars() {
    var i, r = 6371, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
    for ( i = 0; i < 250; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 0 ].vertices.push( vertex );
    }
    for ( i = 0; i < 1500; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 1 ].vertices.push( vertex );
    }
    var stars;
    var starsMaterials = [
      new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
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

// ----------------------------------------------------------------

    function _sunAnimate() {
      if(sun != undefined) {
        var radians = count * Math.PI/180;

        sun.matrixAutoUpdate = false;
        sun.matrix.makeRotationY(radians);
      }
    } // end _sunAnimate()

    function _animatePlanet(planet) {
      if(planet != undefined) {
        var orbitSize = planet.orbit;

        var planetMesh = planet.getObjectByName(planet.name + "Mesh");
        planet.matrixAutoUpdate = false;
        planetMesh.matrixAutoUpdate = false;

        var rotationRadians = planet.rotateSpeed * Math.PI/180;
        var xRadians = count/planet.speed * Math.PI/180;
        var zRadians = (count/planet.speed + 90) * Math.PI/180;


        // rotation needs to be fixed, it's a little off
        var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotationRadians);

        var x = (Math.sin(xRadians) * orbitSize);
        var y = 0;
        var z = (Math.sin(zRadians) * orbitSize);

        planet.matrix.makeTranslation( x, y, z );
        planetMesh.applyMatrix(rotation);

  //      if(count % 90 === 0) { console.log(count, Math.sin(radians), x, y, z ); }
      }
    } // end _animatePlanet()


  } // end animate()

} // end init




} )(THREE);
