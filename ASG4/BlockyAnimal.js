// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

//Code adapted from Prof. Davis videos on Youtube
//Used online documentation and ChatGPT for debugging purposes

var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_viewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_viewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;

  void main() {
   if(u_whichTexture == -2)
   {
    gl_FragColor = u_FragColor;
   }

  else if (u_whichTexture == -1)
  {
     gl_FragColor = vec4(v_UV, 1.0, 1.0);
  }

  else if (u_whichTexture == 0)
  {
   gl_FragColor = texture2D(u_Sampler0, v_UV);
  }
  
  else if (u_whichTexture == 1)
  {
  gl_FragColor = texture2D(u_Sampler1, v_UV);
  }
  
  else
  {
  gl_FragColor = vec4(0, 0, 1, 1);
  }
}`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let a_UV;
let u_GlobalRotateMatrix;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_viewMatrix;
let u_Sampler0;
let u_whichTexture;


function setupWebGL()
{
 // Retrieve <canvas> element
 canvas = document.getElementById('webgl');

 // Get the rendering context for WebGL
 //gl = getWebGLContext(canvas);
gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

 if (!gl) {
   console.log('Failed to get the rendering context for WebGL');
   return;
 }

 gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL()
{
// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
  return;
}

// // Get the storage location of a_Position
 a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
  console.log('Failed to get the storage location of a_Position');
  return;
}

// Get the storage location of u_FragColor
 u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
if (!u_FragColor) {
  console.log('Failed to get the storage location of u_FragColor');
  return;
}

a_UV = gl.getAttribLocation(gl.program, 'a_UV');
if (a_UV < 0) {
  console.log('Failed to get the storage location of a_UV');
  return;
}

u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
  console.log('Failed to get the storage location of u_ModelMatrix');
  return;
}

u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
if (!u_GlobalRotateMatrix) {
  console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  return;

}

u_viewMatrix = gl.getUniformLocation(gl.program, 'u_viewMatrix');
if (!u_viewMatrix) {
  console.log('Failed to get the storage location of u_viewMatrix');
  return;
}

u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
if (!u_ProjectionMatrix) {
  console.log('Failed to get the storage location of u_ProjectionMatrix');
  return;
}

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }


var identityM = new Matrix4();
gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);




//get storage location of u_Size
//u_Size = gl.getUniformLocation(gl.program, 'u_Size');
//if (!u_Size) {
 // console.log('Failed to get the storage location of u_Size ');
  //return;
//}

}

//Globals related to UI elements
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_camera = new Camera();
let g_selectedSize = 5;
let g_segmentSize = 26;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_rightArmAngle = 90;
let g_rightHandAngle = 90;
let g_rightFingerAngle = 90;
let g_armAnimation = false;
let g_mouseLastX = null;
let g_lastFrameTime = performance.now();
let g_frameCount = 0;
let g_fps = 0;


function addActionsForHtmlUI()
{

  document.getElementById("animationArmONbutton").onclick = function() {g_armAnimation = true;};
  document.getElementById("animationArmOFFbutton").onclick = function() {g_armAnimation = false;};



  document.getElementById('red').onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};

  //clear button
  document.getElementById('clear').onclick = function() {g_shapesList = []; renderAllShapes();};

  //point and triangle buttons
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE};

  //picture button
  document.getElementById('pictureButton').onclick = function() {drawPicture();};

  document.getElementById('randomColorButton').onclick = function() {setRandomColor();};




  //sliders 
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});

  //size slider
  //document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});

  //document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_segmentSize = this.value;});

  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});

  document.getElementById('rightArmSlide').addEventListener('mousemove', function() {g_rightArmAngle = this.value; renderAllShapes();});

  document.getElementById('rightHandSlide').addEventListener('mousemove', function() {g_rightHandAngle = this.value; renderAllShapes();});

  document.getElementById('rightFingerSlide').addEventListener('mousemove', function() {g_rightFingerAngle = this.value; renderAllShapes();});


}

function initTextures() {


  var image = new Image();  // Create the image object

  //create second image object
  var image2 = new Image();

  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = 'stone-wall-128x128.jpg';

  image2.onload = function(){ sendTextureToTEXTURE1(image2); };
  // Tell the browser to load an image
  image2.src = 'red-brick-wall-128x128.jpg';

  

  return true;
}



function sendTextureToTEXTURE0(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
 // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

 // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE1(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
 // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

 // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function getMapCellInFront(camera, distance = 1) {
  const forward = camera.at.sub(camera.eye);
  forward.normalize(); // Ensure it's a unit vector

  const posX = camera.eye.elements[0] + forward.elements[0] * distance;
  const posZ = camera.eye.elements[2] + forward.elements[2] * distance;

  const mapX = Math.round(posX + g_map.length / 2);
  const mapZ = Math.round(posZ + g_map[0].length / 2);

  if (mapX >= 0 && mapX < g_map.length && mapZ >= 0 && mapZ < g_map[0].length) {
    return [mapX, mapZ];
  }

  return null; // out of bounds
}



function main() {

  setupWebGL();
  connectVariablesToGLSL();
  
  //connect HTML UI
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;

  //canvas.onmousemove = function(ev) {if(ev.buttons == 1){click(ev)}};

  canvas.onmouseup = () => g_mouseLastX = null;
  canvas.onmouseleave = () => g_mouseLastX = null;

canvas.onmousemove = onMouseMove;


  document.onkeydown = keydown;
  // Specify the color for clearing <canvas>

  initTextures();
  //initMap();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
 // gl.clear(gl.COLOR_BUFFER_BIT);

 //renderAllShapes();
 requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick()
{
  g_seconds = performance.now()/1000.0-g_startTime;

  //console.log(g_seconds);
  const now = performance.now();
  g_frameCount++;
  if (now - g_lastFrameTime >= 1000) {
    g_fps = g_frameCount;
    g_frameCount = 0;
    g_lastFrameTime = now;
    //console.log(`FPS: ${g_fps}`);
  }

  const fpsDisplay = document.getElementById('fpsDisplay');
  if (fpsDisplay) {
    fpsDisplay.textContent = `FPS: ${g_fps}`;
  }

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);

}


var g_shapesList = [];



//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];


function click(ev) {
  
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == POINT)
  {
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE)
  {
    point = new Triangle();
  }
  else
  {
    point = new Circle();
    point.segments = g_segmentSize;
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

 // g_points.push([x, y]);

 // g_colors.push(g_selectedColor.slice());

  //g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
 // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //  g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  //} else if (x < 0.0 && y < 0.0) { // Third quadrant
  //  g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //} else {                         // Others
   // g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  //}

  renderAllShapes();
}


function onMouseMove(ev) {
  if (ev.buttons !== 1) return; // Only rotate when mouse is held down

  if (g_mouseLastX !== null) {
    const deltaX = ev.clientX - g_mouseLastX;

    // Rotate for every N pixels moved
    const threshold = 5;
    if (deltaX > threshold) {
      g_camera.panRightDrag(); // fixed 2 deg
    } else if (deltaX < -threshold) {
      g_camera.panLeftDrag();  // fixed 2 deg
    }
  }

  g_mouseLastX = ev.clientX;
  renderAllShapes();
}


function convertCoordinatesEventToGL(ev)
{
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to g_points array
  return([x, y]);
}

function updateAnimationAngles()
{
  if(g_armAnimation)
  {
    g_rightArmAngle = (-20+45*Math.sin(g_seconds));
  }
}

/* function keydown(ev)
{
  if(ev.keyCode == 37) //right arrow
  {
    g_camera.eye.elements[0] -=0.2;
  }
  else if(ev.keyCode == 39)
  {
    g_camera.eye.elements[0]+=0.2;
  }
  renderAllShapes();
  console.log(ev.keyCode);
} */

  function keydown(ev) {
    switch(ev.key) {
      case 'w':
      case 'W':
        g_camera.forward();
        break;
      case 's':
      case 'S':
        g_camera.back();
        break;
      case 'a':
      case 'A':
        g_camera.left();
        break;
      case 'd':
      case 'D':
        g_camera.right();
        break;
      case 'q':
      case 'Q':
        g_camera.panLeft();
        break;
      case 't':
      case 'T': {
        const front = getMapCellInFront(g_camera);
        if (front) {
          const [x, z] = front;
          g_map[x][z] += 1; // Increase height
        }
        break;
      }
      case 'g':
      case 'G': {
        const front = getMapCellInFront(g_camera);
        if (front) {
          const [x, z] = front;
          if (g_map[x][z] > 0) {
            g_map[x][z] -= 1; // Decrease height
        }
       }
  break;
      }
      case 'e':
      case 'E':
        g_camera.panRight();
        break;
      default:
        return; // exit early if irrelevant key
    }
    renderAllShapes(); // re-render scene after camera movement
  }
  

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

  var g_map = [
  [1,1,1,4,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,4,0,0,1],
  [1,0,0,0,0,0,0,1],
  // [0,0,0,0,0,0,0,0],
   //[1,0,0,0,0,0,0,1],
   //[1,0,0,0,0,0,0,1],
   //[1,0,0,4,0,0,0,1],
   //[1,0,0,0,0,0,0,1],
   //[1,0,0,0,0,0,0,1],
 //  [1,0,0,0,4,0,0,1],
 //  [1,0,0,0,0,0,0,1],
  // [0,0,0,0,0,0,0,0],
  // [1,0,0,0,0,0,0,1],
   ///[1,0,2,0,0,0,0,1],
 //  [1,0,0,4,0,0,0,1],
  // [1,0,0,0,0,0,0,1],
  // [1,0,0,0,0,0,0,1],
  // [1,0,0,0,4,0,0,1],
  // [1,0,0,0,0,0,0,1],
  // [0,0,0,0,0,0,0,0],
  // [1,0,0,0,0,0,0,1],
  // [1,0,2,0,0,0,0,1],
 //  [1,0,0,0,0,0,0,1],
  // [1,0,0,0,0,0,0,1],
  //[1,0,0,0,0,0,0,1],
  //[1,0,0,0,4,0,0,1],
 // [1,0,0,0,0,0,0,1]
];

/* function drawMap()
{
  for(x=0; x<16; x++)
  {
    for(y=0; y<16; y++)
    {
      if(x < 1 || x==31 || y==0 || y == 31)
      {
        var body = new Cube();
        body.color = [1.0, 1.0, 1.0, 1.0];
        body.textureNum = 1;
        body.matrix.translate(x-4, -.85, y-4);
        body.render();
      }
    }
  }
}  */ 

 /*  function drawMap() {
    for (let x = 0; x < g_map.length; x++) {
      for (let y = 0; y < g_map[x].length; y++) {
        let height = g_map[x][y];
        for (let h = 0; h < height; h++) {
          let body = new Cube();
          body.color = [1.0, 1.0, 1.0, 1.0];
          body.textureNum = 1;
          body.matrix.translate(x - g_map.length / 2, -0.85 + h, y - g_map[x].length / 2);
          body.render();
        }
      }
    }
  } */

    function drawMap() {
      let body = new Cube(); // Reuse this cube for all tiles
      body.color = [1.0, 1.0, 1.0, 1.0];
      body.textureNum = 1;
    
      for (let x = 0; x < g_map.length; x++) {
        for (let y = 0; y < g_map[x].length; y++) {
          let height = g_map[x][y];
          for (let h = 0; h < height; h++) {
            // Reset the matrix before each transformation
            body.matrix.setIdentity();
            body.matrix.translate(x - g_map.length / 2, -0.85 + h, y - g_map[x].length / 2);
            body.render();
          }
        }
      }
    }
    
  

function renderAllShapes()
{

var startTime = performance.now();

var projectionM = new Matrix4();
projectionM.setPerspective(50, canvas.width/canvas.height, 1, 100);
gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionM.elements);

var viewM = new Matrix4();

//console.log("This is the eye fields", g_camera.eye.elements);
//console.log("This is the at fields", g_camera.at.elements);
//console.log("This is the up fields", g_camera.up.elements);


//viewM.setLookAt(g_eye[0], g_eye[1], g_eye[2],  g_at[0] ,g_at[1],g_at[2],  0,1,0); // (eye, at, up)

viewM.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1],  g_camera.eye.elements[2],
                g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2], 
                g_camera.up.elements[0],g_camera.up.elements[1], g_camera.up.elements[2]);

gl.uniformMatrix4fv(u_viewMatrix, false, viewM.elements);


var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//drawTriangle3D([-1.0, 0.0, 0.0,   -0.5, -1.0, 0.0, 0.0, 0.0, 0.0]);

//Comment this out until we figure out performance issues:

//drawMap();

//floor
var floor = new Cube();
floor.color = [1.0, 0.0, 0.0, 1.0];
floor.textureNum = 0;
floor.matrix.translate(0, -.75, 0.0);
floor.matrix.scale(100, 0, 100);
floor.matrix.translate(-.5, 0, -0.5);
floor.render();

//sky

var sky = new Cube();
sky.color = [1.0, 0.0, 0.0, 1.0];
sky.textureNum = 99;
sky.matrix.scale(50, 50, 50);
sky.matrix.translate(-.5, -.5, -0.5);
sky.render();

var body = new Cube();
body.color = [1.0, 0.0, 0.0, 1.0];
body.textureNum = 0;
body.matrix.translate(-.25, -.5, 0.0);
body.matrix.scale(0.5, 1, .5);
//body.render();

//var duration = performance.now() - startTime;

var rightArm = new Cube();
rightArm.color = [1,1,0,1];
rightArm.matrix.setTranslate(.25, 0.15, 0.0);
rightArm.matrix.rotate(-g_rightArmAngle, 0, 0, 1);

//rightArm.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);

rightArm.matrix.scale(0.2, .5, .5);
/* 
if(g_armAnimation)
{
  rightArm.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
}
else
{
  rightArm.matrix.rotate(-g_rightArmAngle, 0, 0, 1);
} */

var handCoordinates = new Matrix4(rightArm.matrix);
//rightArm.render();

var rightHand = new Cube();
rightHand.color = [0,1,0,1];
rightHand.matrix = handCoordinates;
rightHand.matrix.translate(0.3, 1.4, 0.0001);
rightHand.matrix.rotate(-g_rightHandAngle, 0, 0, 1);
rightHand.matrix.scale(0.5, 0.5, .5);
var fingerCoordinates = new Matrix4(rightHand.matrix);
//rightHand.render();

var rightFinger = new Cube();
rightFinger.color = [1, 0.6, 0, 1]; 
rightFinger.matrix = fingerCoordinates;
rightFinger.matrix.translate(-0.3, 0.8, 0.0001); 
rightFinger.matrix.rotate(-g_rightFingerAngle, 0, 0, 1); 
rightFinger.matrix.scale(0.4, 0.4, 0.4); 
//rightFinger.render();


var leftArm = new Cube();
leftArm.color = [1,1,0,1];
leftArm.matrix.setTranslate(-.75, 0.15, 0.0);
leftArm.matrix.rotate(-90, 0, 0, 1);
leftArm.matrix.scale(0.2, .5, .5);
//leftArm.render();

var leftHand = new Cube();
leftHand .color = [0,1,0,1];
leftHand.matrix.setTranslate(-0.90, 0.125, 0.0);
leftHand.matrix.rotate(-90, 0, 0, 1);
leftHand.matrix.scale(0.15, .15, .5);
//leftHand.render();

var head = new Cube();
head .color = [1,0,1,1];
head.matrix.setTranslate(-0.1, 0.5, 0.0);
//head.matrix.rotate(-45, 0, 0, 1);
head.matrix.scale(0.25, 0.25, .5);
//head.render();


var rightLeg = new Cube();
rightLeg.color = [1,1,0,1];
rightLeg.matrix.setTranslate(0.05, -0.9, 0.0);
rightLeg.matrix.rotate(0, 0, 0, 1);
rightLeg.matrix.scale(0.2, .4, .5);
//rightLeg.render();

var leftLeg = new Cube();
leftLeg.color = [1,1,0,1];
leftLeg.matrix.setTranslate(-0.05, -0.9, 0.0);
leftLeg.matrix.rotate(0, 0, 0, 1);
leftLeg.matrix.scale(-0.2, .4, .5);
//leftLeg.render();

}

function setTri(x, y, size, color= [1,1,1,1])
{
  let tri = new EquilateralTriangle();
  tri.position = [x, y];
  tri.size = size;
  tri.color = color;
  g_shapesList.push(tri);
}


function drawPicture()
{
  //function to draw the picture

  //christmas trees

  setTri(-0.6, 0.2, 30,[0.0, 1.0, 0.0, 1.0] );
  setTri(-0.6, 0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.6, 0.0, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.6, -0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.6, -0.2, 20, [0.6, 0.3, 0.1, 1]);

  setTri(-0.3, 0.2, 30,[0.0, 1.0, 0.0, 1.0] );
  setTri(-0.3, 0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.3, 0.0, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.3, -0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(-0.3, -0.2, 20, [0.6, 0.3, 0.1, 1]);

  setTri(0, 0.2, 30,[0.0, 1.0, 0.0, 1.0] );
  setTri(0, 0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0, 0.0, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0, -0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0, -0.2, 20, [0.6, 0.3, 0.1, 1]);


  setTri(0.3, 0.2, 30,[0.0, 1.0, 0.0, 1.0] );
  setTri(0.3, 0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.3, 0.0, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.3, -0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.3, -0.2, 20, [0.6, 0.3, 0.1, 1]);

  setTri(0.6, 0.2, 30,[0.0, 1.0, 0.0, 1.0] );
  setTri(0.6, 0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.6, 0.0, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.6, -0.1, 30, [0.0, 1.0, 0.0, 1.0]);
  setTri(0.6, -0.2, 20, [0.6, 0.3, 0.1, 1]);

  


  renderAllShapes();


}

function setRandomColor()
{
  let color1 = Math.random();
  let color2 = Math.random();
  let color3 = Math.random();

  g_selectedColor = [color1, color2, color3, 1.0];
}
