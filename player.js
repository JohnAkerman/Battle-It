function Player() {
    this.pos = createVector(width * .5, height * .5);
    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.w = 48;
    this.h = 48;
    this.radius = 48;
    this.diameter = this.radius / 2;
    this.wHalf = this.w * .5;
    this.hHalf = this.h * .5;
    this.sizeInc = 3;

    this.dir = 3;
    this.firing = 0;

    this.turretAngle = createVector(0, 0);

    this.turretW = 5;
    this.turretH = 25;
    this.turretWHalf = this.turretW / 2;
    this.turretHHalf = this.turretH / 2;

    this.health = 100;
    this.maxHealth = this.health;

    this.shield = 20;
    this.maxShield = this.shield;

    this.indicatorBarWidth = 32;

    this.stationaryFrictionThreshold = 1.0;

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
        rect(this.pos.x, this.pos.y - 15, this.indicatorBarWidth, 5);

        noStroke();
        fill(222,2,2);

        var statPercentage = this.health / this.maxHealth;
        var barWidth = floor(statPercentage * this.indicatorBarWidth);
        rect(this.pos.x, this.pos.y - 14, barWidth, 4);
    }

    this.renderShield = function() {
        // Background grey
        stroke(0,0,0)
        strokeWeight(1);
        fill(88,88,88);
        rect(this.pos.x, this.pos.y - 25, this.indicatorBarWidth, 5);

        noStroke();
        fill(77, 124, 153);

        var statPercentage = this.shield / this.maxShield;
        var barWidth = floor(statPercentage * this.indicatorBarWidth);
        rect(this.pos.x, this.pos.y - 24, barWidth -1, 4);
    }

    this.doDamage = function(val) {
        this.health -= val;

        if (this.health <= 0) {
            this.respawn();
        }
    }

    this.update = function() {
        if ((this.dir === 2 || this.dir === 0) && this.vel.y <= this.stationaryFrictionThreshold) { // Moving Up or Down
            this.accel.mult(0.5);
        }
        else if ((this.dir === 1 || this.dir === 3) && this.vel.x <= this.stationaryFrictionThreshold) { // Moving Left or Right
            this.accel.mult(0.5);
        }

        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        this.vel.mult(0.99); // Friciton
        this.checkBounds();

        this.turretAngle = Math.atan2(mouseY - (this.pos.y + this.hHalf), mouseX - (this.pos.x  + this.wHalf)) - (PI / 2); // 90 deg
    }

    this.render = function() {
        noStroke();
        fill(0,0,255);
        push();
        translate(this.pos.x + this.wHalf, this.pos.y + this.hHalf);
        rotate(radians(this.dir * 90));
        image(playerImage, 0,0, 48,48, -24, -24, 48, 48);
        pop();

        if (DEBUG) {
            fill(255,0,0,100);
            ellipse(this.pos.x + this.wHalf, this.pos.y + this.wHalf, this.radius);

            noStroke();
            fill(255,255,255);
            text("Health: - " + this.health, 3, 10);
            text("Velocity - X: " + roundToPlace(this.vel.x, 3) + " Y:  " + roundToPlace(this.vel.y, 3), 3, 25);

            // Collision position
            fill(255,50,0,50);
            rect(this.pos.x, this.pos.y, this.w, this.h);
        }

        noStroke();
        push();
        translate(this.pos.x + this.wHalf, this.pos.y + this.hHalf);
        rotate(this.turretAngle);
        translate(-24, -14);
        image(playerTurret, this.firing * 48, 0, 48, 0, 0, 0, 48, 48);
        pop();

        if (DEBUG) {
            stroke(255,0,0);
            strokeWeight(1);
            line(this.pos.x + this.wHalf, this.pos.y + this.hHalf, mouseX, mouseY)
        }

        this.renderHealth();
        this.renderShield();
     }

    this.applyForce = function(f) {
        this.accel.add(f);
    }

    this.checkBounds = function() {
        boundsHit = false;
        if (this.pos.x < 0) { this.pos.x = 0; boundsHit = true; this.vel.x *= -1; }
        else if (this.pos.x + this.w >= width) { this.pos.x = width - this.w; boundsHit = true; this.vel.x *= -1; }

        if (this.pos.y < 0) { this.pos.y = 0; boundsHit = true; this.vel.y *= -1; }
        else if (this.pos.y + this.h >= height) { this.pos.y = height - this.h; boundsHit = true; this.vel.y *= -1;  }

        if (boundsHit) {
            var impactHighest = Math.abs((Math.abs(this.vel.x) > Math.abs(this.vel.y)) ? this.vel.x : this.vel.y);
            impactHighest = constrain(Math.ceil(impactHighest), 1, 10);
            this.doDamage(5 * impactHighest);
            this.vel.mult(0.75);
        }
    }
}
