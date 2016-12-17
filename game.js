var player;
var bullets = [];
var explosions = [];
var grid = new Grid();
var isClicking = false;
var playerImage, playerTurret, tracks;

var DEBUG = false;

function preload() {
	playerImage = loadImage("assets/player/playerWithDamage.png");
	playerTurret = loadImage("assets/player/turret.png");
	lightMachineBullet = loadImage("assets/player/bullet.png");
	shell = loadImage("assets/player/shell.png");
	tracks = loadImage("assets/player/tracks.png");

	grid.loadMap(defaultMap);
}

function mousePress() {
	isClicking = true;
}

function mouseRelease() {
	isClicking = false;
}

function setup() {
	var ctx = createCanvas(1584, 864);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	ctx.parent("game");
	ctx.mousePressed(mousePress);
	ctx.mouseReleased(mouseRelease);

	player = new Player();
	colorMode(RGB);
}

function mouseReleased() {
	isClicking = false;
}

function draw() {
	background(0, 255);
	background(29, 29, 29);

	// Updates
	if (isClicking && player.shootingCoolDown <= 0) {
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
	grid.render();

	for (var i = 0; i < bullets.length; i++) {
		bullets[i].render();
	}
	player.render();

	for (var i = 0; i < explosions.length; i++) {
		explosions[i].render();
	}

	fill(255);
	text("FPS: " + floor(frameRate()), 3, 65);

}

function keyPressed() {
	if (keyCode === UP_ARROW || keyCode === 87) {
		player.vel.x *= 0.1
		player.applyForce(createVector(0, -1));
		player.dir = 2;
	} else if (keyCode === DOWN_ARROW|| keyCode === 83) {
		player.vel.x *= 0.1;
		player.applyForce(createVector(0, 1));
		player.dir = 0;
	} else if (keyCode === RIGHT_ARROW|| keyCode === 68) {
		player.vel.y *= 0.1
		player.applyForce(createVector(1, 0));
		player.dir = 3;
	} else if (keyCode === LEFT_ARROW || keyCode === 65) {
		player.vel.y *= 0.1
		player.applyForce(createVector(-1, 0));
		player.dir = 1;
	} else if (keyCode === 32) {  // Space
		DEBUG = !DEBUG;
	} else if (keyCode === 49) { // 1
		player.loadGun(0);
	} else if (keyCode === 50) { // 2
		player.loadGun(1);
	} else if (keyCode === 51) { // 3
		player.loadGun(2);
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
	var force = createVector(-sin(player.turretAngle), cos(player.turretAngle));
	force.mult(player.gunType[player.activeGun].projectileSpeed);
	b.applyForce(force);
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
