function Player() {
    this.pos = createVector(width * .5, height * .5);
    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.w = 20;
    this.h = 20;
    this.wHalf = this.w * .5;
    this.hHalf = this.h * .5;
    this.sizeInc = 3;

    this.turrentAngle = createVector(0, 0);

    this.turretW = 5;
    this.turretH = 25;
    this.turretWHalf = this.turretW / 2;
    this.turretHHalf = this.turretH / 2;

    this.update = function() {
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        this.checkBounds();

        this.turrentAngle = Math.atan2(mouseY - this.pos.y, mouseX - this.pos.x) - 1.5708; // 90 deg
    }

    this.render = function() {
        noStroke();
        fill(0,0,255);
        rect(this.pos.x, this.pos.y, this.w, this.h);

        stroke(255,0,0);
        line(this.pos.x + this.hHalf, this.pos.y + this.wHalf, mouseX, mouseY)

        noStroke();
        push();
        translate(this.pos.x + this.hHalf, this.pos.y + this.wHalf);
        rotate(this.turrentAngle);
        fill(255,255,255);
        rect(-this.turretWHalf, 0, this.turretW, this.turretH);
        pop();

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
