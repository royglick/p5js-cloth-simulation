
class Particle extends VerletParticle2D {

    constructor( x,  y) {
      super(x, y);
      this.col = color(255);
      this.connections = [];
      this.rotate = false;
      this.phase = 0;
    }
  
     display() {
      fill(255);
      ellipse(this.x, this.y, 3, 3);
    }

    attach(s) {
        this.connections.push(s); 
      }

    clicked(px, py) {
        let d = dist(px, py, this.x, this.y);
        if (d < 10) {
          this.col = color(255, 0, 0);
          for (let s of this.connections) {
            s.remove(); 
          }
        }
      }
  }