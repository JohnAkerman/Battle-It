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

    this.damageModel = 0;
    this.lastDmgTime = 0;
    this.lastDmg = 0;

    this.dir = 3;
    this.firing = 0;

    this.turretAngle = createVector(0, 0);

    this.turretW = 5;
    this.turretH = 25;
    this.turretWHalf = this.turretW / 2;
    this.turretHHalf = this.turretH / 2;

    this.health = 100;
    this.maxHealth = this.health;

    this.shield = {
        value : 10,
        valueMax: 10,
        time: 0,
        lastTime: 0,
        regenTime: 5,
        regenRate: .05,
        regenCoolDown: 3500
    };

    this.tracks = [];

    this.indicatorBarWidth = 32;

    this.stationaryFrictionThreshold = 1.0;

    this.gunType = [
        {
            name: 'light-machine',
            coolDown: 3,
            damage: 2,
            lifeSpan: 200,
            projectileSpeed: 22,
            bounce: false
        }, {
            name: "heavy-machine",
            coolDown: 15,
            damage: 10,
            lifeSpan: 200,
            projectileSpeed: 10,
            bounce: true
        }, {
            name: "shell",
            coolDown: 300,
            damage: 35,
            lifeSpan: 300,
            projectileSpeed: 3,
            bounce: false,
            w: 25,
            h: 25
        }
    ];

    this.shootingCoolDown = 0;
    this.activeGun = 0;

    this.respawn = function() {
        this.shield.value = this.shield.valueMax;
        this.health = this.maxHealth;
        this.pos = createVector(random(10, width), random(10, height));
        this.vel.mult(0);
        this.accel.mult(0);
    }

    this.loadGun = function(gunID) {
        this.activeGun = gunID;
        this.shootingCoolDown = this.gunType[gunID].coolDown;
    }

    this.renderBar = function(stat, statMax, yOffset, colour) {
        offscreenBuffer.stroke(0,0,0)
        offscreenBuffer.strokeWeight(1);
        offscreenBuffer.fill(88,88,88);
        offscreenBuffer.rect(this.pos.x, this.pos.y - yOffset, this.indicatorBarWidth, 5);

        offscreenBuffer.noStroke();
        offscreenBuffer.fill(colour);

        var statPercentage = stat / statMax;
        var barWidth = floor(statPercentage * this.indicatorBarWidth);
        if (stat === 0) {
            barWidth = 0;
        }
        offscreenBuffer.rect(this.pos.x + 1, this.pos.y - yOffset + 1, barWidth - 1, 4);
    }

    this.doDamage = function(val) {

        // If shield has been depleted, damage the hull (perma)
        this.lastDmgTime = new Date().getTime();
        if (this.shield.value > 0) {
            this.shield.value -= 1;
        } else if (this.shield.value <= 0 && this.health > 0) {
            this.health -= val;
        }

        if (this.health == 100) { this.damageModel = 0; }
        else if (this.health >= 80 && this.health < 100) { this.damageModel = 1; }
        else if (this.health >= 60 && this.health < 80) { this.damageModel = 2; }
        else if (this.health >= 40 && this.health < 60) { this.damageModel = 3; }
        else if (this.health <= 0) {
            this.damageModel = 4;
            this.respawn();
        }

        this.lastDmg = this.lastDmgTime;
    }


    this.update = function() {
        this.shield.time = new Date().getTime();

        // If shield has been depleted, damage the hull (perma)
        this.lastDmgTime = new Date().getTime();
        // only regen after no damage for a while
        if (this.lastDmgTime - this.lastDmg > this.shield.regenCoolDown) {
            if (this.shield.value < this.shield.valueMax && this.shield.time - this.shield.lastTime > this.shield.regenTime) {
                this.shield.value += this.shield.regenRate;
                this.shield.lastTime = this.shield.time;
            }
        }

        if ((this.dir === 2 || this.dir === 0) && this.vel.y <= this.stationaryFrictionThreshold) { // Moving Up or Down
            this.accel.mult(0.5);
        }
        else if ((this.dir === 1 || this.dir === 3) && this.vel.x <= this.stationaryFrictionThreshold) { // Moving Left or Right
            this.accel.mult(0.5);
        }

        this.vel.add(this.accel);
        this.pos.add(this.vel);

        if ((Math.abs(this.vel.x) > 0.1 || Math.abs(this.vel.y) > 0.1)) {
            this.createTracks();
        }

        this.accel.mult(0);

        this.vel.mult(0.99); // Friciton
        this.checkBounds();

        this.turretAngle = Math.atan2(mouseY - (this.pos.y + this.hHalf), mouseX - (this.pos.x  + this.wHalf)) - (PI / 2); // 90 deg

        // Update tracks
        for (var i = this.tracks.length-1; i >= 0; i--) {
            this.tracks[i].lifeSpan--;

            if (this.tracks[i].lifeSpan <= 0) {
                this.tracks.splice(i, 1);
            }
        }
    }

    this.createTracks = function() {

        var t = {
            x: this.pos.x,
            y: this.pos.y,
            angle : this.dir,
            lifeSpan: 157
        };

        this.tracks.push(t);
    }

    this.render = function() {
        // Render tracks
        if (RENDERBITMAPS) {
            for (var i = this.tracks.length-1; i >= 0; i--) {
                offscreenBuffer.push();
                offscreenBuffer.translate(this.tracks[i].x + this.wHalf, this.tracks[i].y + this.hHalf);
                offscreenBuffer.rotate(radians(this.tracks[i].angle * 90));
                if (RENDERTRACKSALPHA)
                    offscreenBuffer.tint(255, this.tracks[i].lifeSpan);
                offscreenBuffer.image(tracks, 0 , 0, 48, 6, -24, 0, 48, 6);
                offscreenBuffer.pop();
            }
        }

        if (RENDERBITMAPS) {
            offscreenBuffer.noStroke();
            offscreenBuffer.fill(0,0,255);
            offscreenBuffer.push();
            offscreenBuffer.translate(this.pos.x + this.wHalf, this.pos.y + this.hHalf);
            offscreenBuffer.rotate(radians(this.dir * 90));
            offscreenBuffer.image(playerImage, this.damageModel * 48,0, 48,48, -24, -24, 48, 48);
            offscreenBuffer.pop();
        }

        if (DEBUG || RENDERBITMAPS == false) {
            offscreenBuffer.fill(255,0,0,100);
            offscreenBuffer.ellipse(this.pos.x + this.wHalf, this.pos.y + this.wHalf, this.radius);

            offscreenBuffer.noStroke();
            offscreenBuffer.fill(255,255,255);
            offscreenBuffer.text("Health: - " + this.health, 3, 10);
            offscreenBuffer.text("Shield: - " + this.shield.value, 3, 40);
            offscreenBuffer.text("Velocity - X: " + roundToPlace(this.vel.x, 3) + " Y:  " + roundToPlace(this.vel.y, 3), 3, 25);

            // Collision position
            offscreenBuffer.fill(255,50,0,50);
            offscreenBuffer.rect(this.pos.x, this.pos.y, this.w, this.h);
        }

        if (RENDERBITMAPS) {
            offscreenBuffer.push();
            offscreenBuffer.noStroke();
            offscreenBuffer.translate(this.pos.x + this.wHalf, this.pos.y + this.hHalf);
            offscreenBuffer.rotate(this.turretAngle);
            offscreenBuffer.translate(-24, -14);

            var randomShoot = (random(1) > 0.5) ? 1 : 2;
            randomShoot = randomShoot * this.firing;

            offscreenBuffer.image(playerTurret, randomShoot * 48, 0, 48, 0, 0, 0, 48, 48);
            offscreenBuffer.pop();
        }

        if (DEBUG) {
            offscreenBuffer.stroke(255,0,0);
            offscreenBuffer.strokeWeight(1);
            offscreenBuffer.line(this.pos.x + this.wHalf, this.pos.y + this.hHalf, mouseX, mouseY)
        }

        this.renderBar(this.shield.value, this.shield.valueMax, 25, color(77, 124, 153));
        this.renderBar(this.health, this.maxHealth, 14, color(222,2,2));
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
