class TraceObject {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 2);
  }
}
