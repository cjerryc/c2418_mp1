
/**
 * @file A simple WebGL example drawing a triangle with colors
 * @author Eric Shaffer <shaffer1@eillinois.edu>  
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

 /** @global The Modelview matrix */
 var mvMatrix = mat4.create();


/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/**
 * Startup function called from html code to start program.
 */
function startup() {
  
  console.log("No bugs so far...");
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  let buttonResult = document.getElementById("first").checked;
  let secbuttonResult = document.getElementById("second").checked;
  if(buttonResult==1 && secbuttonResult==1){
    buttonResult = 1;
  }
  tick();  
}
/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var context = null;
  context = canvas.getContext("webgl");
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor"); 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "mvMatrix"); 

}

/**
 * Add data to buffers
 */
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  var triangleVertices = 
  [-0.6, 0.35, 0.0,
    0.6, 0.35, 0.0,
   -0.6, 0.85, 0.0,
   -0.6, 0.85, 0.0,
    0.6, 0.35, 0.0,
    0.6, 0.85, 0.0,
   -0.3, 0.35, 0.0,
   -0.3, -0.35, 0.0,
   0.3, -0.35, 0.0,
   -0.3, 0.35, 0.0,
   0.3, -0.35, 0.0,
   0.3, 0.35, 0.0,
   -0.6, -0.35, 0.0,
   -0.6, -0.85, 0.0,
   0.6, -0.85, 0.0,
   -0.6, -0.35, 0.0,
   0.6, -0.85, 0.0,
   0.6, -0.35, 0.0,   //end of blue
   -0.55, 0.4, 0.0,
   0.55, 0.4, 0.0,
  -0.55, 0.8, 0.0,
  -0.55, 0.8, 0.0,
   0.55, 0.4, 0.0,
   0.55, 0.8, 0.0,
  -0.25, 0.4, 0.0,
  -0.25, -0.4, 0.0,
  0.25, -0.4, 0.0,
  -0.25, 0.4, 0.0,
  0.25, -0.4, 0.0,
  0.25, 0.4, 0.0,
  -0.55, -0.4, 0.0,
  -0.55, -0.8, 0.0,
  0.55, -0.8, 0.0,
  -0.55, -0.4, 0.0,
  0.55, -0.8, 0.0,
  0.55, -0.4, 0.0
   ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 36;
    
  vertexColorBuffer = gl.createBuffer();
  var colors = [
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,    // end of blue
    0.90980, 0.29020, 0.15294, 1.0,   
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 36;  
}


function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  mat4.identity(mvMatrix);  //make the identity matrix
  if(buttonResult == 0){
    setMatrixTransform();
  }else{
    breakBuffers();
  }

  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
                          
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

let x = 0;
let y = 1;
let space = 0;
//let count = 0;
function setMatrixTransform(){
  if(x <= y+0.2){                     // scale up
    if(y < x){
      y = 1.21;
    }
    x += 0.01;
    mat4.fromScaling(mvMatrix, [1, x, 1]);    
    space += 0.1;
  }
  else{                               // scale down
    if(y < -1.2){
      y = 1.21;
    }
    y = y-0.01;
    mat4.fromScaling(mvMatrix, [1, y, 1]);
    //count += 1;
    space += 0.1;
  }
  mat4.rotate(mvMatrix, mvMatrix, space * 3.1415926 / 180, [0.6, 0.7, 0.6]);  //rotate after scaling
}

let radvar = 0.05;    //vertex transformation, individual
function customVertex(){
  vertexPositionBuffer = gl.createBuffer();
  radvar += 0.09;
  var triangleVertices = 
  [-0.6, 0.35 * Math.sin(radvar), 0.0,  //same as setup buffer, but multiply 'y' by sine function for fluctuation
    0.6, 0.35 * Math.sin(radvar), 0.0,
   -0.6, 0.85 * Math.sin(radvar), 0.0,
   -0.6, 0.85 * Math.sin(radvar), 0.0,
    0.6, 0.35 * Math.sin(radvar), 0.0,
    0.6, 0.85 * Math.sin(radvar), 0.0,
   -0.3, 0.35 * Math.sin(radvar), 0.0,
   -0.3, -0.35 * Math.sin(radvar), 0.0,
   0.3, -0.35 * Math.sin(radvar), 0.0,
   -0.3, 0.35 * Math.sin(radvar), 0.0,
   0.3, -0.35 * Math.sin(radvar), 0.0,
   0.3, 0.35 * Math.sin(radvar), 0.0,
   -0.6, -0.35 * Math.sin(radvar), 0.0,
   -0.6, -0.85 * Math.sin(radvar), 0.0,
   0.6, -0.85 * Math.sin(radvar), 0.0,
   -0.6, -0.35 * Math.sin(radvar), 0.0,
   0.6, -0.85 * Math.sin(radvar), 0.0,
   0.6, -0.35 * Math.sin(radvar), 0.0,   //end of blue
   -0.55, 0.4 * Math.sin(radvar), 0.0,
   0.55, 0.4 * Math.sin(radvar), 0.0,
  -0.55, 0.8 * Math.sin(radvar), 0.0,
  -0.55, 0.8 * Math.sin(radvar), 0.0,
   0.55, 0.4 * Math.sin(radvar), 0.0,
   0.55, 0.8 * Math.sin(radvar), 0.0,
  -0.25, 0.4 * Math.sin(radvar), 0.0,
  -0.25, -0.4 * Math.sin(radvar), 0.0,
  0.25, -0.4 * Math.sin(radvar), 0.0,
  -0.25, 0.4 * Math.sin(radvar), 0.0,
  0.25, -0.4 * Math.sin(radvar), 0.0,
  0.25, 0.4 * Math.sin(radvar), 0.0,
  -0.55, -0.4 * Math.sin(radvar), 0.0,
  -0.55, -0.8 * Math.sin(radvar), 0.0,
  0.55, -0.8 * Math.sin(radvar), 0.0,
  -0.55, -0.4 * Math.sin(radvar), 0.0,
  0.55, -0.8 * Math.sin(radvar), 0.0,
  0.55, -0.4 * Math.sin(radvar), 0.0
   ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 36;
    
  vertexColorBuffer = gl.createBuffer();
  var colors = [
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,
    0.07451, 0.16078, 0.29412, 1.0,    // end of blue
    0.90980, 0.29020, 0.15294, 1.0,   
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    0.90980, 0.29020, 0.15294, 1.0,
    ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 36;  
}

/* Second animation after radio button is selected
*/ 
let color_change = 0;
function breakBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  color_change += 0.04;
  var triangleVertices = 
  [-0.6- Math.cos(color_change+0.2), 0.35+ Math.cos(color_change+0.2), 0.0,
    0.6+ Math.cos(color_change+0.1), 0.35+ Math.cos(color_change+0.1), 0.0,
   -0.6- Math.cos(color_change+0.3), 0.85+ Math.cos(color_change+0.3), 0.0,
   -0.6- Math.cos(color_change+0.2), 0.85+ Math.cos(color_change+0.2), 0.0,
    0.6+ Math.cos(color_change+0.1), 0.35+ Math.cos(color_change+0.1), 0.0,
    0.6+ Math.cos(color_change+0.3), 0.85+ Math.cos(color_change+0.3), 0.0,
   -0.3- Math.cos(color_change+0.2), 0.35+ Math.cos(color_change+0.2), 0.0,
   -0.3- Math.cos(color_change+0.1), -0.35- Math.cos(color_change+0.1), 0.0,
   0.3+ Math.cos(color_change+0.3), -0.35- Math.cos(color_change+0.3), 0.0,
   -0.3- Math.cos(color_change+0.2), 0.35+ Math.cos(color_change+0.2), 0.0,
   0.3+ Math.cos(color_change+0.1), -0.35- Math.cos(color_change+0.1), 0.0,
   0.3+ Math.cos(color_change+0.3), 0.35+ Math.cos(color_change+0.3), 0.0,
   -0.6- Math.cos(color_change+0.2), -0.35- Math.cos(color_change+0.2), 0.0,
   -0.6- Math.cos(color_change+0.1), -0.85- Math.cos(color_change+0.1), 0.0,
   0.6+ Math.cos(color_change+0.3), -0.85- Math.cos(color_change+0.3), 0.0,
   -0.6- Math.cos(color_change+0.2), -0.35- Math.cos(color_change+0.2), 0.0,
   0.6+ Math.cos(color_change+0.1), -0.85- Math.cos(color_change+0.1), 0.0,
   0.6+ Math.cos(color_change+0.3), -0.35- Math.cos(color_change+0.3), 0.0,   //end of blue
   -0.55- Math.cos(color_change+0.2), 0.4+ Math.cos(color_change+0.2), 0.0,
   0.55+ Math.cos(color_change+0.1), 0.4+ Math.cos(color_change+0.1), 0.0,
  -0.55- Math.cos(color_change+0.3), 0.8+ Math.cos(color_change+0.3), 0.0,
  -0.55- Math.cos(color_change+0.2), 0.8+ Math.cos(color_change+0.2), 0.0,
   0.55+ Math.cos(color_change+0.1), 0.4+ Math.cos(color_change+0.1), 0.0,
   0.55+ Math.cos(color_change+0.3), 0.8+ Math.cos(color_change+0.3), 0.0,
  -0.25- Math.cos(color_change+0.2), 0.4+ Math.cos(color_change+0.2), 0.0,
  -0.25- Math.cos(color_change+0.1), -0.4- Math.cos(color_change+0.1), 0.0,
  0.25+ Math.cos(color_change+0.3), -0.4- Math.cos(color_change+0.3), 0.0,
  -0.25- Math.cos(color_change+0.2), 0.4+ Math.cos(color_change+0.2), 0.0,
  0.25+ Math.cos(color_change+0.1), -0.4- Math.cos(color_change+0.1), 0.0,
  0.25+ Math.cos(color_change+0.3), 0.4+ Math.cos(color_change+0.3), 0.0,
  -0.55- Math.cos(color_change+0.2), -0.4- Math.cos(color_change+0.2), 0.0,
  -0.55- Math.cos(color_change+0.1), -0.8- Math.cos(color_change+0.1), 0.0,
  0.55+ Math.cos(color_change+0.3), -0.8- Math.cos(color_change+0.3), 0.0,
  -0.55- Math.cos(color_change+0.2), -0.4- Math.cos(color_change+0.2), 0.0,
  0.55+ Math.cos(color_change+0.1), -0.8- Math.cos(color_change+0.1), 0.0,
  0.55+ Math.cos(color_change+0.3), -0.4- Math.cos(color_change+0.3), 0.0
   ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 36;
    
  vertexColorBuffer = gl.createBuffer();
  var colors = [
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,
    0.07451* Math.sin(color_change), 0.16078, 0.29412, 1.0,    // end of blue
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,   
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    0.90980, 0.29020* Math.cos(color_change), 0.15294, 1.0,
    ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 36;  
}


/**
 * Tick called for every animation frame.
 */
function tick() {
  requestAnimFrame(tick);
  gl.clear(gl.COLOR_BUFFER_BIT);
   buttonResult = document.getElementById("first").checked;
   secbuttonResult = document.getElementById("second").checked;
  if(buttonResult == 0){
    customVertex();
  }
  draw();
}
