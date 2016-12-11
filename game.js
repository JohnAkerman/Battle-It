var player;

function setup() {
	var ctx = createCanvas(1600, 900);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	ctx.position(x,y);

	player = new Player();
	colorMode(RGB);
}

function draw() {
	background(0, 25);

	// Updates
	player.update();

	// Render
	player.render();
}


function keyPressed() {
	if (keyCode === UP_ARROW) {
		player.applyForce(createVector(0, -1));
	} else if (keyCode === DOWN_ARROW) {
		player.applyForce(createVector(0, 1));
	} else if (keyCode === RIGHT_ARROW) {
		player.applyForce(createVector(1, 0));
	} else if (keyCode === LEFT_ARROW) {
		player.applyForce(createVector(-1, 0));
	}
}
