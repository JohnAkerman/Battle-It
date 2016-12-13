function Particle(x, y, damageValue, colorVal, lifeSpan, radius, canSpawnParticles) {
    this.active = true;
    this.draw = true;
    this.maxDistance = 10000;
    this.lifeSpan = lifeSpan || 200;
    this.startLifeSpan = this.lifeSpan;
    this.damageValue = damageValue || 0;
    this.canSpawnParticles = canSpawnParticles || false;

    this.pos = createVector(x,y);
    this.beginPos = createVector(x, y);

    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.radius = radius;
    this.diameter = this.radius / 2;
    this.color = colorVal || color(255,255,255);

    this.applyForce = function(f) {
        this.accel.add(f);
    }

    this.checkCollision = function (obj) {
        var objOrigin = obj.pos.copy();
        objOrigin.x += obj.wHalf;
        objOrigin.y += obj.hHalf;
        var d = this.pos.dist(objOrigin);

        if (d < this.diameter + obj.diameter) {
            this.active = false;
            this.draw = false;
            return true;
        } else {
            return false;
        }
    }

    this.update = function() {
        if (!this.active) return;

        this.lifeSpan--;

        var d = Math.abs(this.pos.dist(this.beginPos));

        if (d >= this.maxDistance || this.lifeSpan <= 0) {
            this.active = false;
            this.draw = false;
        }

        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        this.checkBounds();

        if (this.startLifeSpan - this.lifeSpan > 5 && this.checkCollision(player)) {
            player.doDamage(this.damageValue);

            // Create explosion
            if (this.canSpawnParticles) {
                var spark = new Particle(this.pos.x, this.pos.y, 0, color(173, 94, 11, 200), random(13,15), random(5,9), false);
                explosions.push(spark);

                spark = new Particle(this.pos.x + random(-5,5), this.pos.y + random(-5, 5), 0, color(206, 149, 18, 200), random(13, 15), random(5,9), false);
                explosions.push(spark);
            }
        }
    }

    this.render = function() {
        stroke(this.color);
        strokeWeight(this.radius);
        point(this.pos.x + this.diameter, this.pos.y + this.diameter);

        if (DEBUG) {
            noStroke();
            fill(255,255,255);
            textSize(14);
            text("L:" + floor(this.lifeSpan), this.pos.x, this.pos.y + 25);

            strokeWeight(1);
            stroke(255,255,255, 100);
            var newVector = createVector(this.vel.x, this.vel.y);
            newVector.mult(6.25);
            line(this.pos.x + this.diameter, this.pos.y + this.diameter, this.pos.x + newVector.x + this.diameter, this.pos.y + newVector.y + this.diameter);
        }
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
