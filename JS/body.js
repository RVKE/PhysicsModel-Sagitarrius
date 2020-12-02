class Body {
  constructor(n, x, y, vx, vy, m, d) {
    this.name = n;
    this.pos = createVector(x, y); //vector van positie in km (vanaf nulpunt)
    this.vel = createVector(vx, vy); //vector van snelheid in km/h
    this.acc = createVector(0, 0); //vector van acceleratie in m/s
    this.force = createVector(0, 0); //vector van nettokracht in Netwon
    this.forces = [];
    this.mass = m; //massa van object in kg
    this.diameter = d; //diameter van object in km
  }

  calculatePos() {
    let combinedForces = createVector(0, 0);
    for (let f = 0; f < this.forces.length; f++) {
      combinedForces.add(this.forces[f]); //tel alle krachten uit de krachtenlijst bij elkaar op in variabele combinedForces om zo de netto kracht op de 'body' te berekenen
    }
    this.force = combinedForces; //zet de nettokracht gelijk aan alle krachten bij elkaar opgeteld

    this.acc = p5.Vector.mult(p5.Vector.div(this.force, this.mass)); //bereken de acceleratievector in m/s^2 met behulp van: a = f/m
    this.vel.add(p5.Vector.mult(this.acc, deltaTime / 1000)); //bereken de snelheidvector in km/s met de acceleratievector in km/h^2
    this.pos.add(p5.Vector.mult(this.vel, deltaTime)); //bereken met de snelheidsvector de positievector in km

    if (bodies.length >= 2) {
      for (let t = 0; t < bodies.length; t++)
        if (this != bodies[t]) {
          let distance = p5.Vector.dist(this.pos, bodies[t].pos) * 1000; //bereken de afstand tussen de twee 'bodies' en reken het om naar meters
          let gravitationalForce = (gravitationalConstant * this.mass * bodies[t].mass) / sq(distance); //bereken de gravitiekracht tussen de twee objecten in Newton
          let dirVector = p5.Vector.sub(this.pos, bodies[t].pos); //bereken de positievector tussen de twee 'bodies'
          let unitDir = createVector(-dirVector.x/sqrt(sq(dirVector.x)+sq(dirVector.y)), -dirVector.y/sqrt(sq(dirVector.x)+sq(dirVector.y))); //bereken de eenheidsrichting
          let newForce = p5.Vector.mult(unitDir, gravitationalForce); //vermenigvuldig de gravitiekracht met de eenheidsrichting om de krachtenvector te krijgen
          this.forces[t] = newForce; //zet de nieuwe kracht in de lijst met alle krachten die op de 'body' werken
        }
    }

  }

  display() {
    fill(255);
    ellipse(this.pos.x/scaleFactor, this.pos.y/scaleFactor, this.diameter/scaleFactor);  //teken het object
    textSize(15);
    textAlign(CENTER, CENTER);
    text(this.name, this.pos.x/scaleFactor, this.pos.y/scaleFactor - this.diameter/scaleFactor/1.5);
  }
}
