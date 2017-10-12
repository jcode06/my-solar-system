// Dependencies:
// - THREE (Three.js)
// - THREE.RingGeometryV2.js - custom ring geometry to get texture right
window.SolarLib = window.SolarLib || {};
( (SolarLib, THREE) => {
  "use strict";

  SolarLib.Planet = Planet;
  SolarLib.PlanetWithRings = PlanetWithRings;
  SolarLib.Sun = Sun;
  SolarLib.Stars = Stars;
  SolarLib.Orbit = Orbit;

  function Planet(params = {}) {
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

  // Create calls the super.create function, and then adds a ring object to the existing planet object
  Planet.prototype.create = function() {
    var planet    = new THREE.Group();
    var mesh      = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshLambertMaterial( { map: this.texture, color: this.color })
    );
    mesh.name     = this.name + "Mesh";
//    mesh.castShadow = false;
//    mesh.receiveShadow = true;

    planet.add(mesh);
    planet.position.set(this.x, this.y, this.z);

    this.object = planet;

    return this.object;
  } // end Planet.create

  Planet.prototype.update = function(curTime = 0) {
    if(this.object != undefined) {
      var orbitSize = this.orbit;
      var x, y, z;

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

      x = (Math.sin(xRadians) * orbitSize);
      y = 0;
      z = (Math.sin(zRadians) * orbitSize);

      this.object.matrixAutoUpdate = false;
      this.object.matrix.makeTranslation( x, y, z );

      if(planetMesh != undefined) {
        planetMesh.matrixAutoUpdate = false;
        planetMesh.applyMatrix(rotation);
      }
    }
  } // end Planet.update

  function PlanetWithRings(params = {}) {
    Planet.call(this, params);

    this.ringsTexture = params.ringsTexture || "";
    this.ringAngle    = !Number.isInteger(params.ringAngle) ? params.ringAngle : 90;
    this.ringDistance = !Number.isNaN(params.ringDistance) ? params.ringDistance : 50;
    this.ringSize     = !Number.isNaN(params.ringSize) ? params.ringSize : 50;
  } // end PlanetWithRings

  PlanetWithRings.prototype = Object.create( Planet.prototype );
  PlanetWithRings.prototype.constructor = PlanetWithRings;

  // Create calls the super.create function, and then adds a ring object to the existing planet object
  PlanetWithRings.prototype.create = function() {
    Planet.prototype.create.call(this);

    var phiSegments = 64;
    var thetaSegments = 64;
    var innerRadius = this.radius + this.ringDistance;
    var outerRadius = this.radius + this.ringDistance + this.ringSize;
    var rotationRadians, rotation;

    var geometry = new THREE.RingGeometryV2(innerRadius, outerRadius, thetaSegments, phiSegments);

    // add rings here
    var ringMesh  = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial( { map: this.ringsTexture, color: this.color, side: THREE.DoubleSide })
//      new THREE.MeshBasicMaterial( { map: this.ringsTexture, color: this.color, side: THREE.DoubleSide })
    );
    ringMesh.name     = this.name + "RingMesh";

    // rotate the ring over to the proper angle
    rotationRadians = this.ringAngle * Math.PI/180;
    rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotationRadians);
    ringMesh.matrixAutoUpdate = false;
    ringMesh.applyMatrix(rotation);

//    ringMesh.castShadow = true;
//    ringMesh.receiveShadow = true;

    this.object.add(ringMesh);

    return this.object;
  } // end PlanetWithRings.update

  // TODO: Emit warning message if textures are null on object instantiation or creation
  function Sun(params = {}) {

    this.name = params.name || "Sun" + Date.now() + (Math.random() * 1000);
    this.glowName = params.glowName || "SunGlow" + Date.now() + (Math.random() * 1000);

    this.sunMaterial = params.sunMaterial || null;
    this.glowMaterial = params.glowMaterial || null;
    this.sunSize = !isNaN(params.sunSize) ? params.sunSize : 500;
    this.glowSize = !isNaN(params.glowSize) ? params.glowSize : this.glowSize + 250;

    this.x            = !Number.isNaN(params.x) ? params.x : 0;
    this.y            = !Number.isNaN(params.y) ? params.y : 0;
    this.z            = !Number.isNaN(params.z) ? params.z : 0;
    this.object       = null;
    this.glowObject   = null;

    this.sunDisplacement = null;
    this.sunNoise        = null;

    params.glowUniforms = params.glowUniforms || {};
    this.glowUniforms = {
      glowFactor:        { value: params.glowUniforms.glowFactor || 0.28 },
      glowPower:         { value: params.glowUniforms.glowPower || 7.33 },
      vNormMultiplier:   { value: params.glowUniforms.vNormMultiplier || 1.0 },
      viewVector:        { value: params.glowUniforms.viewVector || new THREE.Vector3(this.x, this.y, this.z) },
      iTime:             { value: params.glowUniforms.iTime || 0.1 },
      bumpTexture:       { value: params.glowUniforms.bumpTexture || null },
      bumpScale:         { value: params.glowUniforms.bumpScale || 61.0 },
      bumpSpeed:         { value: params.glowUniforms.bumpSpeed || 0.60 },
      iResolution:       { value: params.glowUniforms.iResolution || new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }

    params.sunUniforms = params.sunUniforms || {};
    this.sunUniforms = {
      amplitude:              { value: params.sunUniforms.amplitude || 8.0 },
      texture:                { value: params.sunUniforms.texture || null },
      sphereTexture:          { value: params.sunUniforms.sphereTexture || null },
      iTime:                  { value: params.sunUniforms.iTime || 0.1 },
      brightnessMultiplier:   { value: params.sunUniforms.brightnessMultiplier || 8.0 },
      iResolution:            { value: params.sunUniforms.iResolution || new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }


  } // end Sun

  Sun.prototype.create = function(parentObj) {
    // we must reuse a shader material created for the sun
    if(!this.sunMaterial || !this.glowMaterial) {
      console.error(this.name + " not created, sun and/or glow materials missing.");
      return;
    }
    if(!this.sunUniforms.texture.value || !this.sunUniforms.sphereTexture.value || !this.glowUniforms.bumpTexture.value) {
      console.error(this.name + " not created, sun and/or glow textures missing.");
      return;
    }

    this.sunUniforms.texture.value.wrapS = this.sunUniforms.texture.value.wrapT = THREE.RepeatWrapping;
//    sunUniforms.texture.wrapS = sunUniforms.texture.wrapT = THREE.RepeatWrapping;

    this.glowMaterial.uniforms = this.glowUniforms;
    this.sunMaterial.uniforms = this.sunUniforms;

    var sun = _makeSun.call(this);
    var sunGlow = _makeGlow.call(this);

    sun.add(sunGlow);
    this.object = sun;
    this.glowObject = sunGlow;

    return { sun: this.object, glow: this.glowObject };

    function _makeSun() {
      var sunGeometry = new THREE.SphereBufferGeometry(this.sunSize, 64, 64);

      this.sunDisplacement = new Float32Array( sunGeometry.attributes.position.count );
      this.sunNoise        = new Float32Array( sunGeometry.attributes.position.count );

      for( let i=0; i < this.sunDisplacement.length; i++) {
        this.sunNoise[i] = Math.random() * 5;
      }

      sunGeometry.addAttribute('displacement', new THREE.BufferAttribute(this.sunDisplacement, 1) );

      var sunObj = new THREE.Mesh( sunGeometry, this.sunMaterial );
      sunObj.name = this.name;

      sunObj.position.set(this.x, this.y, this.z);

      return sunObj;
    }

    function _makeGlow() {
        var ballGeometry = new THREE.SphereGeometry( this.sunSize + 250, 32, 16 );
      	var sunGlow = new THREE.Mesh( ballGeometry, this.glowMaterial );
        sunGlow.name = this.glowName;

        sunGlow.position.set(this.x, this.y, this.z);

        return sunGlow;
    }
  } // end Sun.create

  Sun.prototype.update = function(curTime, clock, camera, sunControls = null, glowControls = null) {
    if(this.object != undefined) {
      var rotationRadians = curTime * Math.PI/180;

      //      this.object.matrixAutoUpdate = false;
      //      this.object.matrix.makeRotationY(rotationRadians);

      this.sunUniforms.iTime.value += (sunControls && sunControls.timeFactor) ?
        clock.getDelta() * sunControls.timeFactor :
        clock.getDelta() * -2.15;

      if(sunControls != undefined) {
        var timeRadians = curTime*5 * Math.PI/180

        this.sunUniforms.brightnessMultiplier.value = sunControls.brightness;

        // Amplitude controls the amount of fuzziness in the border, as well as
        // rotation within the vertex
        this.sunUniforms.amplitude.value = sunControls.amplitude * Math.sin( timeRadians * 0.125 );

        var displacementRadians = sunControls.displacement * Math.PI/180;

        for ( var i = 0; i < this.sunDisplacement.length; i ++ ) {

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

        this.object.geometry.attributes.displacement.needsUpdate = true;
      }
    }

    this.glowUniforms.iTime.value += (glowControls && glowControls.glowTimeFactor) ?
      clock.getDelta() * glowControls.glowTimeFactor :
      clock.getDelta() * 1.5;

    var subVector = new THREE.Vector3().subVectors( camera.position, this.glowObject.position );

    this.glowUniforms.viewVector.value = subVector;


    if(this.glowObject != undefined && glowControls != undefined) {
      this.glowUniforms.glowFactor.value = glowControls.glowFactor;
      this.glowUniforms.glowPower.value = glowControls.glowPower;
      this.glowUniforms.vNormMultiplier.value = glowControls.vNormMultiplier;

      this.glowUniforms.bumpScale.value = glowControls.bumpScale;
      this.glowUniforms.bumpSpeed.value = glowControls.bumpSpeed;

      this.glowObject.scale.set(glowControls.size, glowControls.size, glowControls.size);
    }

  } // end Sun.update

  Sun.prototype.onResize = function(width, height) {
    this.glowUniforms.iResolution.value = new THREE.Vector2(width, height);
    this.sunUniforms.iResolution.value = new THREE.Vector2(width, height);
  }


  function Stars(params = {}) {
    this.brightStars          = !isNaN(params.brightStars) ? params.brightStars : 50;
    this.normalStars          = !isNaN(params.normalStars) ? params.normalStars : 375;
    this.spreadMultiplier   = !isNaN(params.spreadMultiplier) ? params.spreadMultiplier : 2000;

    params.colors = params.colors || [];
    this.colors = [];
    this.colors[0] = params.colors[0] || 0xdddddd;
    this.colors[1] = params.colors[1] || 0xdddddd;
    this.colors[2] = params.colors[2] || 0xaaaaaa;
    this.colors[3] = params.colors[3] || 0x7a7a7a;
    this.colors[4] = params.colors[4] || 0x5a5a5a;
    this.colors[5] = params.colors[5] || 0x5a5a5a;

    this.stars = [];
  } // end Stars

  Stars.prototype.create = function() {
    var i, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
    for ( i = 0; i < this.brightStars; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( this.spreadMultiplier );
      starsGeometry[ 0 ].vertices.push( vertex );
    }
    for ( i = 0; i < this.normalStars; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( this.spreadMultiplier );
      starsGeometry[ 1 ].vertices.push( vertex );
    }
    var stars;
    var starsMaterials = [
      new THREE.PointsMaterial( { color: this.colors[0], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: this.colors[1], size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: this.colors[2], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: this.colors[3], size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: this.colors[4], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: this.colors[5], size: 1, sizeAttenuation: false } )
    ];

    for ( i = 10; i < 30; i ++ ) {
      stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
      stars.rotation.x = Math.random() * 6;
      stars.rotation.y = Math.random() * 6;
      stars.rotation.z = Math.random() * 6;
      stars.scale.setScalar( i * 10 );
      stars.matrixAutoUpdate = false;
      stars.updateMatrix();

      this.stars.push(stars);
    }

    return this.stars;
  } // end Stars.create


  function Orbit(params = {}) {
    this.name         = params.name || "Orbit" + Date.now() + (Math.random() * 1000);
    this.orbitSize    = !isNaN(params.orbitSize) ? params.orbitSize : 50;
    this.segments     = !isNaN(params.segments) ? params.segments : 360;
    this.color        = params.color || 0xffffff;

    this.object       = null;
  } // end Orbit
  Orbit.prototype.create = function() {

  } // end Orbit.create

  Orbit.prototype.draw = function() {
    var material = new THREE.LineBasicMaterial({ color: this.color });
    var geometry = new THREE.Geometry();

    for(let i=0; i <= this.segments; i++) {
      var theta = i/this.segments * Math.PI * 2;
      geometry.vertices.push(
        new THREE.Vector3(Math.cos(theta) * this.orbitSize, 0, Math.sin(theta) * this.orbitSize)
      );
    }

    this.object = new THREE.Line(geometry, material);
    return this.object;
  } // end Orbit.draw

  Orbit.prototype.update = function() {

  } // end Orbit.update

})(SolarLib, THREE);
