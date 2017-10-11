// Dependencies:
// - THREE (Three.js)
// - THREE.RingGeometryV2.js - custom ring geometry to get texture right
window.SolarLib = window.SolarLib || {};
( (SolarLib, THREE) => {
  "use strict";

  SolarLib.Planet = Planet;
  SolarLib.PlanetWithRings = PlanetWithRings;

  function Planet(params) {
      this.name         = params.name || "Obj" + Date.now() + (Math.random() * 1000);
      this.texture      = params.texture || "";
      this.orbit        = !Number.isNaN(params.orbit) ? params.orbit : 0;
      this.speed        = !Number.isNaN(params.speed) ? params.speed : 0;
      this.radius       = !Number.isNaN(params.radius) ? params.radius : 0;
      this.color        = params.color || 0xffffff;
      this.rotateSpeed  = !Number.isNaN(params.rotateSpeed) ? params.rotateSpeed : 0;
      this.rotateDir    = (["Up", "Clockwise", "CounterClockwise"]).includes(params.rotateDir) ?
        params.rotateDir : "CounterClockwise";
      this.x            = !Number.isNaN(params.x) ? params.x : 0;
      this.y            = !Number.isNaN(params.y) ? params.y : 0;
      this.z            = !Number.isNaN(params.z) ? params.z : 0;
      this.object       = null;
  }

  Planet.prototype.create = function(targetScene) {
    if(!targetScene) { return; }

    var mesh      = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshLambertMaterial( { map: this.texture, color: this.color })
    );
    mesh.name     = this.name + "Mesh";
    var planet    = new THREE.Group();

//    mesh.castShadow = false;
//    mesh.receiveShadow = true;

    planet.add(mesh);
    targetScene.add(planet);

    planet.position.set(this.x, this.y, this.z);

    this.object = planet;

    return this.object;
  } // end Planet.create

  Planet.prototype.update = function(targetScene, curTime) {
    if(!targetScene) { return; }

    if(this.object != undefined) {
      var orbitSize = this.orbit;

      var planetMesh = this.object.getObjectByName(this.name + "Mesh");

      var rotationRadians = this.rotateSpeed * Math.PI/180;
      var xRadians = curTime/this.speed * Math.PI/180;
      var zRadians = (curTime/this.speed + 90) * Math.PI/180;

      // rotation needs to be fixed, it's a little off
      var rotation;
      if(this.rotationDir == "Up") {
        rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
      }
      else if(this.rotationDir == "Clockwise") {
        rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), -rotationRadians);
      }
      else {
        rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotationRadians);
      }

      var x = (Math.sin(xRadians) * orbitSize);
      var y = 0;
      var z = (Math.sin(zRadians) * orbitSize);

      this.object.matrixAutoUpdate = false;
      this.object.matrix.makeTranslation( x, y, z );

      if(planetMesh != undefined) {
        planetMesh.matrixAutoUpdate = false;
        planetMesh.applyMatrix(rotation);
      }
    }
  } // end Planet.update

  function PlanetWithRings(params) {
    Planet.call(this, params);

    this.ringsTexture = params.ringsTexture || "";
    this.ringAngle    = !Number.isInteger(params.ringAngle) ? params.ringAngle : 90;
    this.ringDistance = !Number.isNaN(params.ringDistance) ? params.ringDistance : 50;
    this.ringSize     = !Number.isNaN(params.ringSize) ? params.ringSize : 50;
  } // end PlanetWithRings

  PlanetWithRings.prototype = Object.create( Planet.prototype );
  PlanetWithRings.prototype.constructor = PlanetWithRings;

  PlanetWithRings.prototype.create = function(targetScene) {
    if(!targetScene) { return; }

    Planet.prototype.create.call(this, targetScene);

    var phiSegments = 64;
    var thetaSegments = 64;
    var innerRadius = this.radius + this.ringDistance;
    var outerRadius = this.radius + this.ringDistance + this.ringSize;

    var geometry = new THREE.RingGeometryV2(innerRadius, outerRadius, thetaSegments, phiSegments);

    // add rings here
    var ringMesh  = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial( { map: this.ringsTexture, color: this.color, side: THREE.DoubleSide })
//      new THREE.MeshBasicMaterial( { map: this.ringsTexture, color: this.color, side: THREE.DoubleSide })
    );
    ringMesh.name     = this.name + "RingMesh";

    // rotate the ring over to the proper angle
    var rotationRadians = this.ringAngle * Math.PI/180;
    var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
    ringMesh.matrixAutoUpdate = false;
    ringMesh.applyMatrix(rotation);

//    ringMesh.castShadow = true;
//    ringMesh.receiveShadow = true;

    this.object.add(ringMesh);

    return this.object;
  } // end PlanetWithRings.update

})(SolarLib, THREE);
