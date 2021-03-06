//function Particle(x, y, damageValue, colorVal, lifeSpan, radius, canSpawnParticles, particleType, rotationAngle, bounce) {
function Particle(options) {
    this.active = true;
    this.draw = true;
    this.maxDistance = 10000;
    this.lifeSpan = options.lifeSpan || 200;
    this.startLifeSpan = this.lifeSpan;
    this.damageValue = options.damageValue || 0;
    this.canSpawnParticles = options.canSpawnParticles || false;
    this.particleType = options.particleType;
    this.rotationAngle = options.rotationAngle;
    this.bounce = options.bounce || false;

    this.pos = createVector(options.x, options.y);
    this.beginPos = createVector(options.x, options.y);

    this.vel = createVector(0, 0);
    this.accel = createVector(0,0);
    this.radius = options.radius;
    this.diameter = this.radius / 2;
    this.color = options.colorVal || color(255,255,255);
    this.w = options.w || this.diameter;
    this.h = options.h || this.diameter;
    this.wHalf = this.w / 2;
    this.hHalf = this.h / 2;

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
        this.checkGridCollision();

        if (this.startLifeSpan - this.lifeSpan > 15 && this.checkCollision(player)) {
            player.doDamage(this.damageValue);
            this.destroyParticle();
        }
    }

    this.destroyParticle = function() {
        this.active = false;
        this.lifeSpan = 0;
        this.vel.mult(0);

        // Create explosion
        if (this.canSpawnParticles) {
            //function Particle(x, y, damageValue, colorVal, lifeSpan, radius, canSpawnParticles, particleType, rotationAngle, bounce) {

            var particleData = {
                x: this.pos.x,
                y: this.pos.y,
                damageValue: 0,
                colorVal: color(173, 94, 11, 200),
                lifeSpan: random(13,15),
                radius: random(5,9),
                canSpawnParticles: false,
                particleType: 'spark',
                rotationAngle: 0,
                bounce: true
            };

            spark = new Particle(particleData);
            explosions.push(spark);

            // Updated values
            particleData = {
                x: this.pos.x + random(-5, 5),
                y: this.pos.y + random(-5, 5),
                colorVal: color(206, 149, 18, 200),
            };
            spark = new Particle(particleData);
            explosions.push(spark);
        }
    }

    this.render = function() {

        if (this.particleType === "light-machine") {
            offscreenBuffer.push();
            offscreenBuffer.translate(this.pos.x, this.pos.y);
            offscreenBuffer.rotate(this.rotationAngle);
            offscreenBuffer.image(lightMachineBullet, 0, 0);
            offscreenBuffer.pop();
        }
        else if (this.particleType === "shell") {
            offscreenBuffer.push();
            offscreenBuffer.translate(this.pos.x - this.wHalf, this.pos.y - this.hHalf);
            offscreenBuffer.rotate(this.rotationAngle);
            offscreenBuffer.image(shell, 0, 0);
            offscreenBuffer.pop();
        }
        else {
            offscreenBuffer.stroke(this.color);
            offscreenBuffer.strokeWeight(this.radius);
            offscreenBuffer.point(this.pos.x + this.diameter, this.pos.y + this.diameter);
        }

        if (DEBUG) {
            offscreenBuffer.noStroke();
            offscreenBuffer.fill(255,255,255);
            offscreenBuffer.textSize(14);
            offscreenBuffer.text("L:" + floor(this.lifeSpan), this.pos.x, this.pos.y + 25);

            offscreenBuffer.strokeWeight(1);
            offscreenBuffer.stroke(255,255,255, 100);
            var newVector = createVector(this.vel.x, this.vel.y);
            newVector.mult(6.25);
            offscreenBuffer.line(this.pos.x + this.diameter, this.pos.y + this.diameter, this.pos.x + newVector.x + this.diameter, this.pos.y + newVector.y + this.diameter);
        }
    }

    this.checkGridCollision = function() {
        // Get current Grid X

        var gridTile = grid.getTileTypeFromXY(this.pos.x, this.pos.y);

        // Check bounce
        if (this.bounce && grid.selectedMap.bounceable.indexOf(gridTile) > -1) {
            this.vel.mult(-1);
        }

        if (this.bounce == false && grid.selectedMap.collidable.indexOf(gridTile) > -1) {
            if (grid.selectedMap.breakable.indexOf(gridTile) > -1) {
                grid.setTileTypeFromXY(this.pos.x, this.pos.y, grid.selectedMap.broken);
            }
            this.destroyParticle();
        }
    }

    this.checkBounds = function() {

        if (this.pos.x < 0) {
            this.pos.x = 0;
            if (this.bounce) {
                this.vel.x *= -1;
            } else {
                this.vel.x = 0;
                this.active = false;
            }
        }
        else if (this.pos.x + this.radius >= width) {
            this.pos.x = width - this.radius;
            if (this.bounce) {
                this.vel.x *= -1;
            } else {
                this.vel.x = 0;
                this.active = false
            }
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
            if (this.bounce) {
                this.vel.y *= -1;
            } else {
                this.vel.y = 0;
                this.active = false
            }
        }
        else if (this.pos.y + this.radius >= height) {
            this.pos.y = height - this.radius;
            if (this.bounce) {
                this.vel.y *= -1;
            } else {
                this.vel.y = 0;
                this.active = false
            }
        }
    }

}
