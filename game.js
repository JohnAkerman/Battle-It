var player;
var bullets = [];
var explosions = [];

var playerImage, playerTurret;

var DEBUG = false;

function preload() {
	playerImage = loadImage("assets/player/playerWithDamage.png");
	playerTurret = loadImage("assets/player/turret.png");
	lightMachineBullet = loadImage("assets/player/bullet.png");
	shell = loadImage("assets/player/shell.png");
}

function setup() {
	var ctx = createCanvas(1600, 900);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	ctx.position(x,y);

	player = new Player();
	colorMode(RGB);
}

function draw() {
	background(0, 255);
	background(29, 29, 29);

	// Updates
	if (mouseIsPressed && player.shootingCoolDown <= 0) {
		fireWeapon();
		player.shootingCoolDown = player.gunType[player.activeGun].coolDown;
	}

	player.shootingCoolDown--;

	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].update();
		if (bullets[i].active == false) {
			bullets.splice(i, 1);
		}
	}

	for (var i = explosions.length - 1; i >= 0; i--) {
		explosions[i].update();
		if (explosions[i].active == false) {
			explosions.splice(i, 1);
		}
	}
	player.update();

	//Render
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].render();
	}
	player.render();

	for (var i = 0; i < explosions.length; i++) {
		explosions[i].render();
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		player.vel.x *= 0.1
		player.applyForce(createVector(0, -1));
		player.dir = 2;
	} else if (keyCode === DOWN_ARROW) {
		player.vel.x *= 0.1;
		player.applyForce(createVector(0, 1));
		player.dir = 0;
	} else if (keyCode === RIGHT_ARROW) {
		player.vel.y *= 0.1
		player.applyForce(createVector(1, 0));
		player.dir = 3;
	} else if (keyCode === LEFT_ARROW) {
		player.vel.y *= 0.1
		player.applyForce(createVector(-1, 0));
		player.dir = 1;
	} else if (keyCode === 32) {  // Space
		DEBUG = !DEBUG;
	} else if (keyCode === 49) { // 1
		player.activeGun = 0;
	} else if (keyCode === 50) { // 2
		player.activeGun = 1;
	} else if (keyCode === 51) { // 3
		player.activeGun = 2;
	}

	if (DEBUG)
		console.log(keyCode);
}


function fireWeapon() {
	player.firing = 1;

	var activeGun = player.gunType[player.activeGun];

	var particleData = {
		x: player.pos.x + player.wHalf,
		y: player.pos.y + player.hHalf,
		damageValue: activeGun.damage,
		colorVal: null,
		lifeSpan: activeGun.lifeSpan,
		radius: 3,
		canSpawnParticles: true,
		particleType: activeGun.name,
		rotationAngle: player.turretAngle,
		bounce: activeGun.bounce,
		w: activeGun.w,
		h: activeGun.h,
	}

	var b = new Particle(particleData);
	var bForce = createVector(-sin(player.turretAngle), cos(player.turretAngle));

	bForce.mult(player.gunType[player.activeGun].projectileSpeed);
	b.applyForce(bForce);
	bullets.push(b);
}

function mouseReleased() {
	player.firing = 0;
}

roundToPlace = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};
