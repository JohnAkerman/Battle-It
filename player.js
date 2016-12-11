function Player() {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0,0);
    this.accel = createVector(0,0);
    this.w = 20;
    this.h = 20;

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

    this.checkBounds = function() {
        reset = false;
        if (this.pos.x < 0) { this.pos.x = 0; reset = true; }
        else if (this.pos.x + this.w >= width) { this.pos.x = width - this.w; reset = true; }

        if (this.pos.y < 0) { this.pos.y = 0; reset = true; }
        else if (this.pos.y + this.h >= height) { this.pos.y = height - this.h; reset = true; }

        if (reset) {
            this.accel.mult(0);
            this.vel.mult(0);
        }
    }
}
