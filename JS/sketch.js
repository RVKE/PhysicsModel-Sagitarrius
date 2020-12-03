let scaleFactor = 400000; //1 pixel op het beeldscherm is standaard gelijk aan dit aantal in de simulatie
let bodies = [];
let traceObjects = [];
const gravitationalConstant = 6.674*(10**-11); //gravitatieconstante
let deltaTime = 10; //tijdstappen
let backgroundImage;
let selectedBody;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  setBackgroundImage();
  strokeWeight(4);

  createBody("Sagittarius A*", 0, 0, 0, 0, 8.550*(10**36), 44000000); //roep functie aan die Sagittarius A* body aanmaakt.

  input = createInput("beginsnelheid y (km/s)");
  input.position(0, 90)
  input.style('font-size', '17px');
  input.center("horizontal");

  placeButton("PLAATS AARDE", 0, 30, 30, true, function() { if(bodies.length < 6) { createBody("Earth", -150000000, 0, 0, int(input.value()), 5.972*(10**24), 12742);}});
  placeButton("RESET SIMULATIE", windowWidth-160, 20, 15, false, function() { location.reload();});
  placeButton("RESET LIJNEN", windowWidth-300, 20, 15, false, function() { for (let p = 0; p < traceObjects.length; p++) { traceObjects.splice(p);}});
}

function createBody(n, x, y, vx, vy, m, d) {
  newBody = new Body(n, x, y, vx, vy, m, d);
  bodies.push(newBody);
}

function placeButton(text, x, y, size, centered, action) {
  button = createButton(text);
  button.position(x, y);
  button.style('font-size', size + "px");
  button.style('color', 'white');
  button.style('background-color', 'transparent');
  button.style('border-style', 'solid');
  button.style('border-color', 'white');
  button.style('outline', 'none');
  button.mousePressed(action);
  if (centered) {
    button.center("horizontal");
  }
}

function setBackgroundImage() {
  backgroundImage = createImage(windowWidth, windowHeight);
  for (let x = 0; x < backgroundImage.width; x++) {
    for (let y = 0; y < backgroundImage.height; y++) {
      backgroundImage.set(x, y, noise(x/150, y/150)*random(10, 30));
    }
  }
  for (let j = 0; j < 400; j++) {
    backgroundImage.set(random(backgroundImage.width), random(backgroundImage.height), random(100, 255));
  }
  backgroundImage.updatePixels();
}

function drawInterface() {

  fill(255);
  text("deltaTime = " + deltaTime + " (wijzig met pijltjestoetsen ↑↓)", windowWidth/2, 150);
  text("1 pixel = " + scaleFactor + "km (verander met [E] en [Q])", windowWidth/2, 180);

  for (let b = 0; b < bodies.length; b++) {
    fill(255);
    if (bodies[b] == selectedBody) {
      stroke(255, 0, 0, 180);
    }
    if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(50, 50 + b * 90)) <= 35) {
      ellipse(50, 50 + b * 90, 75);
      textSize(26-bodies[b].name.length);
    } else {
      ellipse(50, 50 + b * 90, 70);
      textSize(25-bodies[b].name.length);
    }
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    text(bodies[b].name, 50, 50 + b * 90);
    fill(255);
    textSize(10);
    text(b, 15, 15 + b * 90);
    fill(255);
    textSize(15);
    if (bodies[b].name == "Earth") {
      text("startsnelheid: " + bodies[b].startVelY, 180, 40 + b * 90);
      text("max afwijking: " + round(bodies[b].maxOrbitRadiusDifference/scaleFactor/1000*100)/100 + "px", 180, 60 + b * 90);
    }
  }

  if (selectedBody != null) {
    fill(40, 40, 40, 150);
    rect(windowWidth-250, windowHeight/2-200, 250, 400);
    fill(255);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Name: " + selectedBody.name, windowWidth-220, windowHeight/2-160);
    text("Mass: " + selectedBody.mass + "kg", windowWidth-220, windowHeight/2-120);
    text("Diameter: " + selectedBody.diameter + "km", windowWidth-220, windowHeight/2-80);
    text("Pos: (" + round(selectedBody.pos.x) + ", " + round(selectedBody.pos.y) + ") km", windowWidth-220, windowHeight/2-40);
    text("Vel: (" + round(selectedBody.vel.x) + ", " + round(selectedBody.vel.y) + ") km/s", windowWidth-220, windowHeight/2);
    text("Acc: (" + round(selectedBody.acc.x) + ", " + round(selectedBody.acc.y) + ") km/s^2", windowWidth-220, windowHeight/2+40);
    text("Force: (" + round(selectedBody.force.x/10**27)*10**27 + ", " + round(selectedBody.force.y/10**27)*10**27 + ") N", windowWidth-220, windowHeight/2+80);

    rect(windowWidth-175, windowHeight/2+100, 100, 100);
    stroke(255, 0, 0);
    let velDir = createVector(selectedBody.vel.x/sqrt(sq(selectedBody.vel.x)+sq(selectedBody.vel.y)), selectedBody.vel.y/sqrt(sq(selectedBody.vel.x)+sq(selectedBody.vel.y)));
    line(windowWidth-125, windowHeight/2+150, windowWidth-125 + velDir.x * 50, windowHeight/2+150 + velDir.y * 50)
    stroke(0, 255, 0);
    let accDir = createVector(selectedBody.acc.x/sqrt(sq(selectedBody.acc.x)+sq(selectedBody.acc.y)), selectedBody.acc.y/sqrt(sq(selectedBody.acc.x)+sq(selectedBody.acc.y)));
    line(windowWidth-125, windowHeight/2+150, windowWidth-125 + accDir.x * 50, windowHeight/2+150 + accDir.y * 50)
    noStroke();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    deltaTime *= 2;
  } else if (keyCode === DOWN_ARROW) {
    deltaTime /= 2;
  }
  if (keyCode == "69") {
    scaleFactor /= 2;
    for (let r = 0; r < traceObjects.length; r++) {
      traceObjects[r].pos.mult(2);
    }
  } else if (keyCode == "81") {
    scaleFactor *= 2;
    for (let r = 0; r < traceObjects.length; r++) {
      traceObjects[r].pos.div(2);
    }
  }
}

function mouseClicked() {
  for (let b = 0; b < bodies.length; b++) {
    if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(50, 50 + b * 90)) <= 70) {
      selectedBody = bodies[b];
    }
  }
}

function draw() {
  background(0);
  image(backgroundImage, 0, 0);
  drawInterface();
  translate(windowWidth/2, windowHeight/2);

  for (let t = 0; t < traceObjects.length; t++) {
    traceObjects[t].display();
  }

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].calculatePos();
    bodies[i].display();
    newTrace = new TraceObject(bodies[i].pos.x/scaleFactor, bodies[i].pos.y/scaleFactor);
    traceObjects.push(newTrace);
  }
}
