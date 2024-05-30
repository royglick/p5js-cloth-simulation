class Spring extends VerletSpring2D {

    constructor(a, b, springStrength) {
      super(a, b, gap, springStrength);
      this.toDelete = false;
      physics.addSpring(this);
    }
    
    display() {
    if (gui.showTension) {
        let mag = dist(this.a.x, this.a.y, this.b.x, this.b.y)
        let redGradient = map(mag,30,0,185,94);
        let greenGradient = map(mag,30,0,0,179);
        let blueGradient = map(mag,30,0,0,20,);
        stroke(redGradient,greenGradient,blueGradient);
    } else {
        stroke(255);
    }
    strokeWeight(0.5);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
}

    remove() {
        physics.removeSpring(this);
        this.toDelete = true;
      }
    }

