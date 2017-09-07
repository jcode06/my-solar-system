( (THREE) => {
  "use strict";

// textures

window.addEventListener("load", init, false);

var scene, camera, renderer, controls; // global vars needed throughout the program
var cube, sphere;
var sun, earth;
var width = window.innerWidth;
var height = window.innerHeight;
var aspectRatio = width / height;
var count = 0;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 20000);
  camera.position.z = 400;

  var ambientLight = new THREE.AmbientLight(0xCCCCCC, 1);
  scene.add(ambientLight);
/*
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(50, 0, 20);
  scene.add(spotLight);
*/
  // create sun like sphere
  var pointLight = new THREE.PointLight(0xFDFFA7, 1, 1000, 2);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  var sunLoader = new THREE.TextureLoader();
  sunLoader.load(
      "assets/sunmap.jpg",
      function(texture) {
        var geometry  = new THREE.SphereGeometry(100, 32, 32);
        var material  = new THREE.MeshLambertMaterial( { emissiveMap: texture, emissive: 0xFDFFA7 });
        sun           = new THREE.Mesh( geometry, material );
        scene.add(sun);
      }
  )

  var earthLoader = new THREE.TextureLoader();
  earthLoader.load(
    "assets/earthmap1k.jpg",
    function(texture) {
      var geometry  = new THREE.SphereGeometry(10, 32, 32);
      var material  = new THREE.MeshLambertMaterial( { map: texture, color: 0x2194ce });
      var earthMesh     = new THREE.Mesh( geometry, material );
      earthMesh.name = "earthMesh";
      earth         = new THREE.Group();
      earth.add(earthMesh);

      scene.add(earth);
    }

  )

  // create objects for the scene
//  cube = createCube();
//  sphere = createSphere();
//  createSkybox();


  renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  animate();



  function animate() {
    requestAnimationFrame( animate );

    controls.update();

    count = (count+1) % 360;
    var radians = count * Math.PI/180;

    if(sun != undefined) {
      sun.matrixAutoUpdate = false;
      sun.matrix.makeRotationY(radians);
    }

    if(earth != undefined) {
      var obj = new THREE.Object3D();

      earth.matrixAutoUpdate = false;
      var earthMesh = earth.getObjectByName("earthMesh");
//      earth.earthMesh.matrixAutoUpdate = false;

      var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), radians/50);
      var translation = new THREE.Matrix4().makeTranslation(Math.cos(radians) * 4, 0, Math.sin(radians) * 4);
//      earth.applyMatrix(new THREE.Matrix4().multiplyMatrices(rotation, translation) );
      earth.applyMatrix( translation );
      earthMesh.applyMatrix(rotation);
    }

    renderer.render( scene, camera );
  }

} // end init


function createCube() {
  var geometry  = new THREE.BoxGeometry( 10, 10, 10 );
//  var material  = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var material  = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
  var newCube   = new THREE.Mesh( geometry, material );
//  newCube.position.set(0, 0, 0);
  scene.add(newCube);

  return newCube;
} // end createCube

function createSphere() {
  var geometry  = new THREE.SphereGeometry(6, 32, 32);
  var material  = new THREE.MeshPhongMaterial( { color: 0x2194ce, specular: 0x555555 });
  var newSphere    = new THREE.Mesh( geometry, material );
//  newSphere.position.set(15, 10, 0);
  scene.add(newSphere);

  return newSphere;
}

function createSkybox() {
  var imagePrefix = "assets/dawnmountain-";
  var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
  var imageSuffix = ".png";
  var skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000);

  var skyMaterial = [];
  for(let i=0; i < 6; i++) {
    skyMaterial.push( new THREE.MeshBasicMaterial( {
      map: new THREE.TextureLoader().load( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
    }) );
  }
  var skybox = new THREE.Mesh( skyGeometry, skyMaterial );
  scene.add(skybox);
}


} )(THREE);
