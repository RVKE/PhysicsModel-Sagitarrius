let scaleFactor = 400000; //1 pixel op het beeldscherm is standaard gelijk aan dit aantal in de simulatie
let bodies = [];
const gravitationalConstant = 6.674*(10**-11); //gravitatieconstante
let deltaTime = 10; //tijdstappen
let backgroundImage;
let selectedBody;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  setBackgroundImage();

  createBody("Sagittarius A*", 0, 0, 0, 0, 8.550*(10**36), 44000000); //roep functie aan die Sagittarius A* body aanmaakt.

  //input = createInput("beginsnelheid y (km/h)");
  //input.position(0, 90)
  //input.style('font-size', '17px');
  //input.center("horizontal");
  //button = createButton('PLAATS AARDE');
  //button.position(0, 30);
  //button.style('font-size', '27px');
  //button.center("horizontal");
  //button.mousePressed(function() { createBody("Earth", -150000000, 0, 0, int(input.value()), 5.972*(10**24), 12742);});
}

function createBody(n, x, y, vx, vy, m, d) {
  newBody = new Body(n, x, y, vx, vy, m, d);
  bodies.push(newBody);
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
  fill(40, 40, 40, 150);
  rect(0, 0, 100, windowHeight);
  fill(148, 56, 181, 150);
  rect(100, 0, 5, windowHeight);
  fill(40, 40, 40, 150);
  rect(windowWidth/2-150, 0, 300, 75);
  fill(255);
  text("deltaTime = " + deltaTime, windowWidth/2, 140);
  text("wijzig met pijltjestoetsen ↑↓", windowWidth/2, 160);

  for (let b = 0; b < bodies.length; b++) {
    fill(255);
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
    text("Vel: (" + round(selectedBody.vel.x) + ", " + round(selectedBody.vel.y) + ") km/h", windowWidth-220, windowHeight/2);
    text("Acc: (" + round(selectedBody.acc.x) + ", " + round(selectedBody.acc.y) + ") m/s^2", windowWidth-220, windowHeight/2+40);
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

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].calculatePos();
    bodies[i].display();
  }
}
