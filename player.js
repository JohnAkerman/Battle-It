function Player() {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.w = 20;
    this.h = 20;
    this.sizeInc = 3;

    this.update = function() {
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        this.checkBounds();
    }

    this.render = function() {
        noStroke();
        fill(0,0,255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    this.applyForce = function(f) {
        this.accel.add(f);
    }

    this.increaseSize = function() {
        this.w += this.sizeInc;
        this.h += this.sizeInc;
    }

    this.checkBounds = function() {
        reset = false;
        if (this.pos.x < 0) { this.pos.x = 0; reset = true; this.vel.x *= -1; }
        else if (this.pos.x + this.w >= width) { this.pos.x = width - this.w; reset = true; this.vel.x *= -1; }

        if (this.pos.y < 0) { this.pos.y = 0; reset = true; this.vel.y *= -1; }
        else if (this.pos.y + this.h >= height) { this.pos.y = height - this.h; reset = true; this.vel.y *= -1;  }

        if (reset) {
            this.accel.mult(0);
            this.increaseSize();
        }
    }
}
