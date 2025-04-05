// DrawTriangle.js (c) 2012 matsuda

//Code inspired by Eloquent Javascript Documentation

function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //add vector
  let v1 = new Vector3([2.25, 2.25, 0]);





  // Draw a blue rectangle
 // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
 // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color

   drawVector(v1, "red");
}

//define drawVector function

function drawVector(v, color)
{
  //use lineTo to draw the vector
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.strokeStyle = color; 
  ctx.moveTo(200, 200);
  let new_x = 200 + v.elements[0] * 20;
  let new_y = 200 - v.elements[1] * 20;
  ctx.lineTo(new_x, new_y);
  ctx.stroke()
  
}

function areaTriangle(v1, v2)
{
  let cross = Vector3.cross(v1, v2);
  console.log(cross);
  let cross_mag = cross.magnitude();
  return (cross_mag * 0.5);
}

function angleBetween(v1, v2)
{
  //basically just a computation and output to console
  let mag_v1 = v1.magnitude();
  let mag_v2 = v2.magnitude();
  let dot = Vector3.dot(v1, v2);

  let computation = (dot) / (mag_v1 * mag_v2);

  //take inverse cosine and convert to degrees
  let inverse_rad = Math.acos(computation);

  //convert to degrees
  let angle = (180/Math.PI) * inverse_rad;
  return angle;
}

//handleDrawEvent

function handleDrawEvent()
{
  let canvas = document.getElementById("example");
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = parseFloat(document.getElementById('x').value);
  let y = parseFloat(document.getElementById('y').value);

  let sec_x = parseFloat(document.getElementById('second_x').value);
  let sec_y = parseFloat(document.getElementById('second_y').value);
  
  let v1 = new Vector3([x, y, 0]);
  let v2 = new Vector3([sec_x, sec_y, 0]);
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function handleDrawOperationEvent()
{
  let canvas = document.getElementById("example");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = parseFloat(document.getElementById('x').value);
  let y = parseFloat(document.getElementById('y').value);
  let sec_x = parseFloat(document.getElementById('second_x').value);
  let sec_y = parseFloat(document.getElementById('second_y').value);

  let v1 = new Vector3([x, y, 0]);
  let v2 = new Vector3([sec_x, sec_y, 0]);
  drawVector(v1, "red");
  drawVector(v2, "blue");
  let operation = document.getElementById("operation").value;

  if (operation === "add")
  {
    let v3 = v1.add(v2);
    console.log("this is v3", v3);
    drawVector(v3, "green");
  }
  else if (operation === "sub")
  {
    let v3 = v1.sub(v2);
    drawVector(v3, "green");
  }
  else if (operation === "mult")
  {
    //need to parse the scalar's value
    let scalar = parseFloat(document.getElementById('scalar').value);
    let v3 = v1.mul(scalar);
    let v4 = v2.mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (operation === "magnitude")
  {
    //simply need to output magnitude of the vector to the console
    let  mag_v1 = v1.magnitude();
    let  mag_v2 = v2.magnitude();
    console.log("Magnitude v1: ",  mag_v1);
    console.log("Magnitude v2: ",  mag_v2);
  }
  else if (operation === "normalize")
  {
    let normal_v1 = v1.normalize();
    let normal_v2 = v2.normalize();

    drawVector(normal_v1, "green");
    drawVector(normal_v2, "green");
  }
  else if (operation == "area")
  {
    let area = areaTriangle(v1, v2);
    console.log("Area: ", area);
  }
  else if (operation === "angle_between")
  {
    let angle = angleBetween(v1, v2);
    console.log("Angle: ", angle);
  }
  else
  {
    let scalar = parseFloat(document.getElementById('scalar').value);
    let v3 = v1.div(scalar);
    let v4 = v2.mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
}
