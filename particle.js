function Particle(x,y, doesDamage) {
    this.doesDamage = doesDamage || false;

    this.active = true;
    this.draw = true;
    this.maxDistance = 100;
    this.lifeSpan = 200;

    this.pos = createVector(x,y);
    this.beginPos = createVector(x, y);

    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.radius = 3;
    this.color = color(255,255,255);

    this.applyForce = function(f) {
        this.accel.add(f);
    }

    this.update = function() {
        if (!this.active) return;

        this.lifeSpan--;

        var d = Math.abs(dist(this.pos, this.beginPos));

        if (d >= this.maxDistance || this.lifeSpan <= 0) {
            this.active = false;
            this.draw = false;
        }

        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        this.checkBounds();
    }

    this.render = function() {
        stroke(this.color);
        strokeWeight(this.radius);
        point(this.pos.x, this.pos.y);
    }

    this.checkBounds = function() {
        reset = false;
        if (this.pos.x < 0) { this.pos.x = 0; reset = true; this.vel.x *= -1; }
        else if (this.pos.x + this.radius >= width) { this.pos.x = width - this.radius; reset = true; this.vel.x *= -1; }

        if (this.pos.y < 0) { this.pos.y = 0; reset = true; this.vel.y *= -1; }
        else if (this.pos.y + this.radius >= height) { this.pos.y = height - this.radius; reset = true; this.vel.y *= -1;  }

        if (reset) {
            // this.accel.mult(0);
        }
    }

}
