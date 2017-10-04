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
  var textureUranusRings  = textureLoader.load( "assets/uranusringcolour.jpg" );

  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.02 );

  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100000);
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


  var pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 1);
  // create our solar objects as the textures get loaded
  sun           = new THREE.Mesh(
                    new THREE.SphereGeometry(100, 64, 64),
                    new THREE.MeshPhongMaterial( { emissive: 0xFDFFA7, emissiveIntensity: 0.2, emissiveMap: textureSun, color: 0xFDFFA7 })
//                    new THREE.MeshBasicMaterial( { map: textureSun, color: 0xFDFFA7 })
                  );
  pointLight.add(sun);
  scene.add(pointLight);

  var earthSize = 50;
  var earthOrbit = 500;
  var lineSegments = 360;

  var curOrbit = earthOrbit * .38;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Mercury",  createPlanet({
    name: "Mercury", texture: textureMercury,
    orbit: curOrbit, speed: 1,
    radius: earthSize * .38, rotateSpeed: 0.017,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * .72;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Venus",  createPlanet({
    name: "Venus", texture: textureVenus,
    orbit: curOrbit, speed: 2,
    radius: earthSize * .95,
    color: 0xffffff, rotateSpeed: 0.004,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Earth",  createPlanet({
    name: "Earth", texture: textureEarth,
    orbit: earthOrbit, speed: 3,
    radius: earthSize, rotateSpeed: 1,
    color: 0x2194ce,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 1.52
  drawOrbit(curOrbit, lineSegments);
  planets.set("Mars",  createPlanet({
    name: "Mars", texture: textureJupiter,
    orbit: curOrbit, speed: 4,
    radius: earthSize * .53, rotateSpeed: 0.975,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 5.20;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Jupiter",  createPlanet({
    name: "Jupiter", texture: textureJupiter,
    orbit: curOrbit, speed: 5,
    radius: earthSize * 11.20,
    color: 0xffffff, rotateSpeed: 2.43,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 9.53;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Saturn",  createPlanetWithRings({
    name: "Saturn", texture: textureSaturn, ringsTexture: textureSaturnRings, ringAngle: 90,
    orbit: curOrbit, speed: 5.5,
    radius: earthSize * 9.45, rotateSpeed: 2.35,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 19.18;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Uranus",  createPlanetWithRings({
    name: "Uranus", texture: textureUranus, ringsTexture: textureUranusRings, ringAngle: 0,
    orbit: curOrbit, speed: 8,
    radius: earthSize * 4.00, rotateSpeed: 1.34,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 30.04;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Neptune",  createPlanet({
    name: "Neptune", texture: textureNeptune,
    orbit: curOrbit, speed: 10,
    radius: earthSize * 3.88, rotateSpeed: 1.25,
    color: 0xffffff,
    x: 0, y:0, z:0
  }) );

  curOrbit = earthOrbit * 39.51;
  drawOrbit(curOrbit, lineSegments);
  planets.set("Pluto",  createPlanet({
    name: "Pluto", texture: texturePluto,
    orbit: curOrbit, speed: 15,
    radius: earthSize * 0.19, rotateSpeed: 0.15,
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


//  var ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.1);
  var ambientLight = new THREE.AmbientLight(0xCCCCCC, 1.0);
  scene.add(ambientLight);

  var hemisphereLight = new THREE.AmbientLight(0xCCCCCC, 0x000000, 1.0);
  scene.add(hemisphereLight);


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

  function drawOrbit(radius = 200, segments = 360) {
    var material = new THREE.LineBasicMaterial({ color:0xffffff });
    var geometry = new THREE.Geometry();
  //  geometry.vertices.shift();
    for(let i=0; i < segments; i++) {
      var theta = i/segments * Math.PI * 2;
      geometry.vertices.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
      );
    }

    scene.add( new THREE.Line(geometry, material) );
  }

  function createPlanet(params) {
    var geometry  = new THREE.SphereGeometry(params.radius, 32, 32);
    var material  = new THREE.MeshLambertMaterial( { map: params.texture, color: params.color });
    var mesh      = new THREE.Mesh( geometry, material );
    mesh.name     = params.name + "Mesh";
    var planet    = new THREE.Group();
    planet.add(mesh);
    scene.add(planet);

    // set planet properties
    for(let key in params) {
      if( ["name", "size", "orbit", "speed", "rotateSpeed", "ringAngle"].includes(key) ) {
        planet[key] = params[key];
      }
    }

    planet.position.set(params.x, params.y, params.z);

    return planet;
  }

  function createPlanetWithRings(params) {
    var planet = createPlanet(params);


    // refactor this, maybe put it in its own THREE.js function, like RingGeometryV2 or something
    var phiSegments = 32;
    var thetaSegments = 32;
    var thetaStart = thetaStart !== undefined ? thetaStart : 0;
  	var thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
    var innerRadius = params.radius - 50;
    var outerRadius = params.radius + 150;
    var radius = innerRadius;
    var radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
    var thetaStart = 0;

    var geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments);
/*

    var uvs = [];
    var vertices = [];

    for ( let j = 0; j <= phiSegments; j++ ) {
      for ( let i = 0; i <= thetaSegments; i++ ) {

        var vertex = new THREE.Vector3();
  			var segment = thetaStart + i / thetaSegments * thetaLength;

  			vertex.x = radius * Math.cos( segment );
  			vertex.y = radius * Math.sin( segment );

  			vertices.push( vertex );

        uvs.push( new THREE.Vector2( j / thetaSegments, i / phiSegments ) );
      }
      radius += radiusStep;
    }
    geometry.verticesNeedUpdate = true;
    geometry.vertices = vertices;

    geometry.uvsNeedUpdate = true;
    geometry.faceVertexUvs = uvs;
*/
//    var geometry = new THREE.RingGeometryV2(innerRadius, outerRadius, thetaSegments, phiSegments);


    // add rings here
    var newMesh      = new THREE.Mesh(
      geometry,
//      new THREE.MeshLambertMaterial( { map: params.ringsTexture, color: params.color, side: THREE.DoubleSide })
      new THREE.MeshBasicMaterial( { map: params.ringsTexture, color: params.color, side: THREE.DoubleSide })
    );

    // rotate the ring over
    var rotationRadians = planet.ringAngle * Math.PI/180;
    var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
    newMesh.matrixAutoUpdate = false;
    newMesh.applyMatrix(rotation);

    planet.add(newMesh);

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
        var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotationRadians);

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

} // end init

/*
//THREE.RingGeometryV2 = function( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {
function RingGeometryV2( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {
  this.parameters = {
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    thetaSegments: thetaSegments,
    phiSegments: phiSegments,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  innerRadius = innerRadius || 20;
  outerRadius = outerRadius || 50;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

  thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
  phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1;

  // buffers

  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];

  // some helper variables

  var segment;
  var radius = innerRadius;
  var radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
  var vertex = new THREE.Vector3();
  var uv = new THREE.Vector2();
  var j, i;

  // generate vertices, normals and uvs

  for ( j = 0; j <= phiSegments; j ++ ) {

    for ( i = 0; i <= thetaSegments; i ++ ) {

      // values are generate from the inside of the ring to the outside

      segment = thetaStart + i / thetaSegments * thetaLength;

      // vertex

      vertex.x = radius * Math.cos( segment );
      vertex.y = radius * Math.sin( segment );

      vertices.push( vertex.x, vertex.y, vertex.z );

      // normal

      normals.push( 0, 0, 1 );

      // uv
//      uv.x = ( vertex.x / outerRadius + 1 ) / 2;
//      uv.y = ( vertex.y / outerRadius + 1 ) / 2;
      uv.x = j / thetaSegments;
      uv.y = i / phiSegments;

      uvs.push( uv.x, uv.y );

    }

    // increase the radius for next row of vertices

    radius += radiusStep;

  }

  // indices

  for ( j = 0; j < phiSegments; j ++ ) {

    var thetaSegmentLevel = j * ( thetaSegments + 1 );

    for ( i = 0; i < thetaSegments; i ++ ) {

      segment = i + thetaSegmentLevel;

      var a = segment;
      var b = segment + thetaSegments + 1;
      var c = segment + thetaSegments + 2;
      var d = segment + 1;

      // faces

      indices.push( a, b, d );
      indices.push( b, c, d );

    }

  }

  // build geometry

  this.setIndex( indices );
  this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
  this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
  this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
}

RingGeometryV2.prototype = Object.create( THREE.BufferGeometry.prototype );
RingGeometryV2.prototype.constructor = RingGeometryV2;
*/

} )(THREE);
