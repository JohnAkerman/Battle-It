function setup() {
	var ctx = createCanvas(1600, 900);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	ctx.position(x,y);
}

function draw() {
	colorMode(RGB);
	background(50, 25);
}
