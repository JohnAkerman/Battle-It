function Player() {
    this.pos = createVector(width * .5, height * .5);
    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.w = 20;
    this.h = 20;
    this.radius = 20;
    this.wHalf = this.w * .5;
    this.hHalf = this.h * .5;
    this.sizeInc = 3;

    this.turrentAngle = createVector(0, 0);

    this.turretW = 5;
    this.turretH = 25;
    this.turretWHalf = this.turretW / 2;
    this.turretHHalf = this.turretH / 2;

    this.health = 100;
    this.maxHealth = this.health;

    this.shield = 20;
    this.maxShield = this.shield;

    this.indicatorBarWidth = 32;

    this.respawn = function() {
        this.shield = this.maxShield;
        this.health = this.maxHealth;
        this.pos = createVector(random(10, width), random(10, height));
        this.vel.mult(0);
        this.accel.mult(0);
    }

    this.renderHealth = function() {
        // Background grey
        stroke(0,0,0)
        strokeWeight(1);
        fill(88,88,88);
        rect(this.pos.x - 15, this.pos.y - 25, this.indicatorBarWidth, 5);

        noStroke();
        fill(222,2,2);

        var statPercentage = this.health / this.maxHealth;
        var barWidth = floor(statPercentage * this.indicatorBarWidth);
        rect(this.pos.x - 14, this.pos.y - 24, barWidth, 4);
    }

    this.renderShield = function() {
        // Background grey
        stroke(0,0,0)
        strokeWeight(1);
        fill(88,88,88);
        rect(this.pos.x - 15, this.pos.y - 35, this.indicatorBarWidth, 5);

        noStroke();
        fill(77, 124, 153);

        var statPercentage = this.shield / this.maxShield;
        var barWidth = floor(statPercentage * this.indicatorBarWidth);
        rect(this.pos.x - 14, this.pos.y - 34, barWidth -1, 4);
    }

    this.doDamage = function(val) {
        this.health -= val;

        if (this.health <= 0) {
            this.respawn();
        }
    }

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
        push();
        translate(this.pos.x - this.wHalf, this.pos.y - this.hHalf);
        rect(0, 0, this.w, this.h);
        pop();

        if (DEBUG) {
            fill(255,0,0,100);
            ellipse(this.pos.x, this.pos.y, this.radius);

            stroke(255,0,0);
            strokeWeight(1);
            line(this.pos.x, this.pos.y, mouseX, mouseY)

            noStroke();
            fill(255,255,255);
            text("Health: - " + this.health, 0, 10);
        }

        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.turrentAngle);
        fill(255,255,255);
        rect(-this.turretWHalf, 0, this.turretW, this.turretH);
        pop();

        this.renderHealth();
        this.renderShield();
    }

    this.applyForce = function(f) {
        this.accel.add(f);
    }

    this.checkBounds = function() {
        reset = false;
        if (this.pos.x < 0) { this.pos.x = 0; reset = true; this.vel.x *= -1; }
        else if (this.pos.x + this.w >= width) { this.pos.x = width - this.w; reset = true; this.vel.x *= -1; }

        if (this.pos.y < 0) { this.pos.y = 0; reset = true; this.vel.y *= -1; }
        else if (this.pos.y + this.h >= height) { this.pos.y = height - this.h; reset = true; this.vel.y *= -1;  }

        if (reset) {
            // this.accel.mult(0);
        }
    }
}
