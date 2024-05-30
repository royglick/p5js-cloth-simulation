
let gui = {
  cols: 50, 
  rows: 50,
  gravityY: 0,
  gravityX: 0,
  springStrength: 0.2,
  topRightAmp: 0,
  topRightPhase: false,
  topLeftAmp: 0,
  topLeftPhase: false,
  bottomLeftAmp: 0,
  bottomLeftPhase: false,
  bottomRightAmp: 0,
  bottomRightPhase: false,
  frequency: 0.1,
  backgroundColor: "rgb(0, 0,0)",
  displayPoints: false,
  displayLines: true,
  showTension: false,

};
let particles;
let springs=[];
let gap = 10;
let physics;
let gravity;
let gb;
let frames = 0;
let r;
let clothBorderGap = 40;

let topRightPt;
let topRightPhase;

let topLeftPt;
let topLeftPhase;

let bottomRightPt;
let bottomRightPhase;

let bottomLeftPt;
let bottomLeftPhase;


let gui_col = new dat.GUI();
let general = gui_col.addFolder("General")
let shake = gui_col.addFolder("Shake")
let display = gui_col.addFolder("Display")


general.add(gui, 'cols', 0, 100).name("Columns").step(1).onChange(
  function(){
    springs = [];
    startEverything();
  }
);
general.add(gui, 'rows', 0, 100).name("Rows").step(1).onChange(
  function(){
    springs = [];
    startEverything();
  }
);
general.add(gui, 'gravityX', -1, 1).name("Gravity - X").step(0.1).onChange(
  function(){
  gravity = new Vec2D(gui.gravityX, gui.gravityY);
  gb = new GravityBehavior(gravity);
  physics.behaviors.pop()
  physics.addBehavior(gb);
  }
);
general.add(gui, 'gravityY', -1, 1).name("Gravity - Y").step(0.1).onChange(
  function(){
  gravity = new Vec2D(gui.gravityX, gui.gravityY);
  gb = new GravityBehavior(gravity);
  physics.behaviors.pop()
  physics.addBehavior(gb);
  }
);
general.add(gui, 'springStrength', 0, 1.7).name("Spring Strength").step(0.1).onChange(
  function(){
    for (let s of springs) {
      s.strength = gui.springStrength
  }
}
);

shake.add(gui, 'topRightAmp', 0, 400).name("Top Right Amplitude").step(1).onChange(
  function(){
    topRightPt.rotate = true
  }
);
shake.add(gui, 'topRightPhase').name("Top Right Switch Phase").onChange(
  function(){
    topRightPt.phase += radians(180)
  }
);
shake.add(gui, 'topLeftAmp', 0, 400).name("Top Left Amplitude").step(1).onChange(
  function(){
    topLeftPt.rotate = true
  }
);
shake.add(gui, 'topLeftPhase').name("Top Left Switch Phase").onChange(
  function(){
    topLeftPt.phase += radians(180)
  }
);
shake.add(gui, 'bottomLeftAmp', 0, 400).name("Bottom Left Amplitude").step(1).onChange(
  function(){
    bottomLeftPt.rotate = true
  }
);
shake.add(gui, 'bottomLeftPhase').name("Bottom Left Switch Phase").onChange(
  function(){
    bottomLeftPt.phase += radians(180)
  }
);
shake.add(gui, 'bottomRightAmp', 0, 400).name("Bottom Right Amplitude").step(1).onChange(
  function(){
    bottomRightPt.rotate = true
  }
);
shake.add(gui, 'bottomRightPhase').name("Bottom Right Switch Phase").onChange(
  function(){
    bottomRightPt.phase += radians(180)
  }
);
shake.add(gui, 'frequency', 0, 0.1).name("Frequency").step(0.01);
display.addColor(gui, "backgroundColor").name("Backgroung Color")
display.add(gui, 'displayPoints').name("Display Points")
display.add(gui, 'displayLines').name("Display Springs")
display.add(gui, 'showTension').name("Display Length")


function startEverything () {
  particles = make2DArray(gui.cols,gui.rows)
  physics = new VerletPhysics2D();
  gravity = new Vec2D(gui.gravityX, gui.gravityX);
  gb = new GravityBehavior(gravity);
  physics.addBehavior(gb);
  physics.setWorldBounds(new Rect(0+10, 0+10, width-15, height-15));

  // build particles initial locations
  let x = gui.cols + gui.rows;
  for (let i = 0; i < gui.cols; i++) {
    let y = 10;
    for (let j = 0; j < gui.rows; j++) {
      let p = new Particle(x, y);
      particles[i][j] = p;
      physics.addParticle(p);
      y = y + gap;
    }
    x = x + gap;
  }

  // build springs between particles
  for (let i = 0; i < gui.cols; i++) {
    for (let j = 0; j < gui.rows; j++) {
      let a = particles[i][j];
      // skip last column
      if (i != gui.cols-1) {
        let b1 = particles[i+1][j];
        let s1 = new Spring(a, b1, gui.springStrength);
        springs.push(s1);
        a.attach(s1);
      }
      // skip last row
      if (j != gui.rows-1) {
        let b2 = particles[i][j+1];
        let s2 = new Spring(a, b2, gui.springStrength);
        springs.push(s2);
        a.attach(s2);
      }
    }
  }
  // top left lock and loc
  topLeftPt = particles[0][0];
  topLeftPt.lock();
  topLeftPt.x=clothBorderGap;
  topLeftPt.y=clothBorderGap;
  // top right lock and loc
  topRightPt = particles[gui.cols-1][0];
  topRightPt.lock();
  topRightPt.x=width - clothBorderGap;
  topRightPt.y=clothBorderGap;
  // bottom left lock and loc
  bottomLeftPt = particles[0][gui.rows-1];
  bottomLeftPt.lock();
  bottomLeftPt.x=clothBorderGap;
  bottomLeftPt.y=height - clothBorderGap;
  // bottom right lock and loc
  bottomRightPt = particles[gui.cols-1][gui.rows-1];
  bottomRightPt.lock();
  bottomRightPt.x=width - clothBorderGap;
  bottomRightPt.y=height - clothBorderGap;
  console.log(springs)

}

function setup() {
  createCanvas(760, 760); 
  startEverything()
}

function draw() {
  background(gui.backgroundColor);
  physics.update();

  // display particles
  if (gui.displayPoints) {
    for (let i = 0; i < gui.cols; i++) {
      for (let j = 0; j < gui.rows; j++) {
        particles[i][j].display();
      }
    }
  }
  
  // rotate
  if (topLeftPt.rotate) {
    topLeftPt.x=clothBorderGap + gui.topLeftAmp*sin(frames*gui.frequency + topLeftPt.phase);
    topLeftPt.y=clothBorderGap + gui.topLeftAmp*sin(frames*gui.frequency + topLeftPt.phase);
  }
  if (topRightPt.rotate) {
    topRightPt.x= width - clothBorderGap + gui.topRightAmp*sin(frames*gui.frequency + topRightPt.phase);
    topRightPt.y= clothBorderGap -gui.topRightAmp*sin(frames*gui.frequency + topRightPt.phase);
  }
  if (bottomLeftPt.rotate) {
    bottomLeftPt.x=clothBorderGap + gui.bottomLeftAmp*sin(frames*gui.frequency + bottomLeftPt.phase);
    bottomLeftPt.y= height - clothBorderGap -gui.bottomLeftAmp*sin(frames*gui.frequency + bottomLeftPt.phase);
  }
  if (bottomRightPt.rotate) {
    bottomRightPt.x=width -clothBorderGap + gui.bottomRightAmp*sin(frames*gui.frequency + bottomRightPt.phase);
    bottomRightPt.y=height -clothBorderGap +gui.bottomRightAmp*sin(frames*gui.frequency + bottomRightPt.phase);
  }

  // display springs
  if (gui.displayLines) {
    for (let s of springs) {
      s.display();
    }
  }
  frames +=1
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function mouseDragged() {
  for (let i = 0; i < gui.cols; i++) {
     for (let j = 0; j < gui.rows; j++) {
      particles[i][j].clicked(mouseX, mouseY);
      
    }
  }
}
