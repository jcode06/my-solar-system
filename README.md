A Basic Solar System Simulation
- First WebGL Project, helps with understanding rotation, translation in WebGL/Three.js better, as well as shaders/GLSL.

TODOS:
- Sun/Glow Texture: Add color uniforms so we can modify the color and create different colored suns
- Sun Texture: There's an obvious break in the texture overlay, figure out how to smooth it out
- Figure out a way to make the smaller planets more visible in relation to the sun, right now they are too small
- Enable explorer camera controls (FlyControls)

BUGS:
- MOBILE: Cache seems to be saved when reloading a page, so sometimes the camera is off-center, and hard to manipulate
- ALL: Corona layer isn't aligned when the sun is positioned off-center, or not (0,0,0)

OPTIONAL:
  - Add shadows to the planets when applicable
  - Asteroid belt between Mars and Jupiter
    - Figure out how to draw asteroids

  - Add a view such that you can lock onto and follow a planet's orbit
  - Figure out how to do Pluto's unusual orbit:
    - Set Pluto's rotation direction to 120 degrees (on its side)
    - https://airandspace.si.edu/exhibitions/exploring-the-planets/online/solar-system/pluto/orbit.cfm


Textures courtesy of James Hastings-Trew via website links below
http://planetpixelemporium.com/index.php
http://planetpixelemporium.com/planets.html
Purely for educational, non-commercial use in this instance

Another Great Source of Textures:
https://www.solarsystemscope.com/textures

Cool Shader of the Sun:
https://www.shadertoy.com/view/4dXGR4

Interesting way to use displacement and amplitude to change parts of a sphere:
https://threejs.org/examples/webgl_custom_attributes.html

Shader Converter, ShaderFrog
https://stackoverflow.com/a/32577051/4906991

Size of the Planets:
https://www.universetoday.com/36649/planets-in-order-of-size/

Astronomy & Facts about Planets:
http://www.enchantedlearning.com/subjects/astronomy/planets/

Size of the Sun and Planets:
Sun      = 2180 units - (1,319,106 km / 864,400 miles) - 218 times the size of Earth
Jupiter  = 109 units - (69,911 km / 43,441 miles) – 10.9 times the size of Earth
Saturn   = 91 units - (58,232 km / 36,184 miles) – 9.14 times the size of Earth
Uranus   = 40 units - (25,362 km / 15,759 miles) – 3.98 times the size of Earth
Neptune  = 40 units - (24,622 km / 15,299 miles) – 3.86 times the size of Earth
Earth    = 10 units - (6,371 km / 3,959 miles)
Venus    = 10 units - (6,052 km / 3,761 miles) – 0.95 times the size of Earth
Mars     = 6 units - (3,390 km / 2,460 miles) – 0.62 times the size of Earth
Mercury  = 4 units - (2,440 km / 1,516 miles) – 0.38 times the size of Earth


Orbit Calculations:
- Earth   = 500 units (93 million miles)
- Mercury = Earth * .38   = 190 (36 million miles)
- Venus   = Earth * .72   = 360 (67.2 million miles)
- Mars    = Earth * 1.52  = 760 (141.6 million miles)
- Jupiter = Earth * 5.20  = 2600 (483.6 million miles)
- Saturn  = Earth * 9.53  = 4765 (886.7 million miles)
- Uranus  = Earth * 19.18 = 9590 (1784.0 million miles)
- Neptune = Earth * 30.04 = 15020 (2794.4 million miles)
- Pluto   = Earth * 39.51 = 19755  (3674.5 million miles)

100,000 Stars, includes a model of the solar system
http://stars.chromeexperiments.com/
https://www.html5rocks.com/en/tutorials/casestudies/100000stars/

Advanced: Creating Saturn in Blender
https://design.tutsplus.com/tutorials/how-to-create-a-saturn-infographic-with-blender-and-inkscape--cms-23257

Good Thread on how to apply a textures radially in Three.js
https://stackoverflow.com/questions/24634971/how-can-i-apply-a-radial-texture-to-a-ring-with-three-js-r67
https://stackoverflow.com/questions/23633913/non-radial-texture-mapping-over-a-ring-geometry-in-webgl-using-three-js

Dat GUI & Tutorial:
https://github.com/dataarts/dat.gui
http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage

Useful threads and examples by Lee Stemkoski on adding a glow:
https://stackoverflow.com/questions/16269815/three-js-outer-glow-for-sphere-object
http://stemkoski.github.io/Three.js/Selective-Glow.html
http://stemkoski.github.io/Three.js/Shader-Halo.html
https://stackoverflow.com/questions/17455776/three-js-shader-code-for-halo-effect-normals-need-transformation/
http://stemkoski.github.io/Three.js/Shader-Fireball.html
