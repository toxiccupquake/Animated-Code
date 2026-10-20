

let recMode = false;
let can;  // create a canvas reference
let systems;

let wave;

let amplitude = 300;
let period = 300;
let phase = 0;

let fountains = [];

let bg1, bg2;


function setup() {
  can = createCanvas(1920, 1080);
  frameRate(30);
  systems = [];

  console.log(frameCount);

  bg1 = color(0);
  bg2 = color(255);

  for (let i = 0; i < 10; i++) {
    fountains.push(new TH_GreenFountain(createVector(100 + i * 200, 50)));
  }
  

}//------------------------------ END OF SETUP ----------------------------

function draw() {
  let bg;

  if (frameCount <= 800) {
    bg = color(0);
  } else if (frameCount <= 1200) {
    let amt = map(frameCount, 800, 1200, 0, 1);
    bg = lerpColor(bg1, bg2, amt);
  } else {
    bg = bg2;
  }

  background(bg);
  if (frameCount <= 500) {
    console.log("Act 1");
    act1();
  } else if (frameCount <= 1000) {
    console.log("Act 2");
    act2();
  } else {
    console.log("Act 3");
    act3();
  }
  
  recordit();

  phase += 0.05;

}//----------------------- END OF DRAW --------------------------


class Particle {
  constructor(position) {
    this.position = position.copy();
    this.velocity = createVector(2, 0);
    this.lifespan = 255;

    this.shape = new TriangleShape(50);
 
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    // move horizontally
    this.position.x += this.velocity.x;
    
  }

  display() {
    let y = height/2 + sin((this.position.x / period) + phase) * amplitude;
    this.shape.display(this.position.x, y, this.lifespan);
  }

  isDead() {
    return this.lifespan < 0;
  }
}//------------------END OF CLASS---------------------------------------


class TH_SquareParticle {
  constructor(position) {
    this.position = position.copy();
    this.acceleration = createVector(1,0);
    this.velocity = createVector(random(-1,1.5), random(-1,1.5));
    
    this.lifespan = 255;

  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.lifespan -= 2;
  }

  display() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(255,255,255, this.lifespan);
    rect(this.position.x, this.position.y, 20,20);
  }

  isDead() {
    return this.lifespan < 0;
  }
}//-----------------------------END OF CLASS----------------------------------------


class TH_SquareParticle2 {
  constructor(position) {
    this.position = position.copy();
    this.acceleration = createVector(1,0);
    this.velocity = createVector(random(-1,1.5), random(-1,1.5));
    
    this.lifespan = 255;

  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.lifespan -= 2;
  }

  display() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(random(255),255,255, this.lifespan);
    rect(this.position.x, this.position.y, 50,50);
  }

  isDead() {
    return this.lifespan < 0;
  }
}//-----------------------------END OF CLASS----------------------------------------

class TH_GreenFountain {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }

  addParticle() {
    let p;
    
    if (random() < 0.5) {
      p = new TH_GreenParticle(this.origin);
    } else {
      p = new TH_GreenCrazyParticle(this.origin);
    }
    this.particles.push(p);
  }

  run() {
    this.addParticle();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();

      if (p.isDead()) {
        this.particles.splice(i,1);
      }
    }
  }



}//---------------------------------END OF CLASS-------------------------------

class TH_GreenParticle {
  constructor(position) {
    this.position = position.copy();
    this.acceleration = createVector(0,0.05);
    this.velocity = createVector(random(-1,1), random(-1,1));
    this.lifespan = 300;
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }

  display() {
    noStroke();
    fill(0,255,0, this.lifespan);
    ellipse(this.position.x, this.position.y, 40,40);
  }

  isDead() {
    return this.lifespan < 0;
  }
}//-----------------------------END OF CLASS-----------------------


class TH_GreenCrazyParticle extends TH_GreenParticle {
  constructor(origin) {
    super(origin);
    this.theta = 0;
    }

    update() {
      super.update();
      this.theta += (this.velocity.x * this.velocity.mag())/10;
    }

    display() {
      super.display();

      push();
        translate(this.position.x, this.position.y);
        rotate(radians(this.theta));
          stroke(255,this.lifespan);
          line(0,0,10,0);
      pop();
    }
  }//-------------------------END OF CLASS----------------------------



class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }

  addParticle() {
    let p;
  
    if (frameCount <= 500) {
      // ACT 1
      let x = map(frameCount, 0, 500, width, 0);
      let pos = createVector(x, this.origin.y);
      p = new TH_SquareParticle(pos);
  
    } else if (frameCount <= 1000) {
      // ACT 2
      if (random() < 0.5) {
        p = new Particle(this.origin);
      } else {
        p = new CrazyParticle(this.origin);
      }
  
    } else {
      // ACT 3
      if (random() < 0.33) {
        p = new Particle(this.origin);
      } else if (random() < 0.66) {
        p = new CrazyParticle(this.origin);
      } else {
        p = new TH_SquareParticle2(this.origin);
      }
    }
  
    this.particles.push(p);
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}//----------------------------END OF CLASS-----------------------


class TriangleShape {
  constructor(size = 20) {
    this.size = size;
  }

  display(x, y, lifespan) {
    noStroke();
    fill(random(255),random(255),random(255), lifespan);

    triangle(
      x, y,
      x + this.size, y + this.size * 2,
      x - this.size, y + this.size * 2
    );
  }
}//------------------------END OF CLASS-----------------


class CrazyParticle extends Particle {
  constructor(origin) {
    super(origin);
    this.theta = 0;
  }

  update() {
    super.update();
    this.theta += 0.1;
  }

  display() {
    let y = height/2 + sin((this.position.x / period) + phase) * amplitude;
    
    push();
    translate(this.position.x, y);
    //rotate(this.theta);
      stroke(255, this.lifespan);
      fill(random(255), random(255), random(255), this.lifespan);
      this.shape.display(0,0, this.lifespan);
    
    pop();
  }
}//----------------------------END OF CLASS-----------------------


function act1() {
  if (frameCount % 10 === 0) {
    systems.push(new ParticleSystem(createVector(0, height/2)));
  }

  for (let i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
}//-----------------------------END OF ACT 1---------------------------------

function act2() {
  if (frameCount % 10 === 0) {
    systems.push(new ParticleSystem(createVector(0,height/2)));
  }

  for (let i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }

  
}//-----------------------------END OF ACT 2----------------------

function act3() {
  if (frameCount > 600 && frameCount <= 1500) {

    for (let f of fountains) {
      f.run();
    }
  } 
  
  for (let i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
 
  if (frameCount % 10 === 0) {
    systems.push(new ParticleSystem(createVector(0, height/2)));
  }

}//--------------------------END OF ACT 3---------------------------




// press space to start/stop recording
function keyPressed() {
  if (key === " " || key === "Spacebar") {
    recMode = true;
    loop();
    console.log("Recording started...");
  }

  if (key === "r" || key === "R") {
    recMode = false;
    loop();
    console.log("Begin canvas.")
  }

  if (key === "s" || key === "S") {
    recMode = false;
    noLoop();
    console.log("Recording stopped.");
  }
}//----------------------END OF KEY PRESSED-------------------------



function recordit() {  // new version
  if (recMode == true) {
      let ext = nf(frameCount, 4);  // 0001
      saveCanvas(can, 'frame-' + ext, 'jpg');
      console.log("rec " + ext);
  }
}//--------------------END OF RECORD FUNCTION------------------------