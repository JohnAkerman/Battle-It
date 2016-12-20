function Grid() {
    this.selectedMap = null;
    this.grid = null;
    this.tileSize  = null;
    this.bitmaps = [];

    this.bitmapKeys = [];

    this.loadMap = function(newMap) {
        this.selectedMap = newMap;
        this.grid = this.selectedMap.grid;
        this.tileSize = this.selectedMap.tileSize;
        this.bitmaps = [];

        for (var key in this.selectedMap.tiles) {
            if (!this.selectedMap.tiles.hasOwnProperty(key)) continue;
            var obj = this.selectedMap.tiles[key];
            var tmp = loadImage(obj);
            this.bitmapKeys.push(key)
            this.selectedMap.tiles[key] = tmp;
        }
    }

    this.checkCollision = function(obj) {

    }

    this.getTileType = function(gridX, gridY) {
        return this.grid[gridY][gridX];
    }

    this.getTileTypeFromXY = function(x,y) {
        return this.grid[this.toGrid(y)][this.toGrid(x)];
    }

    this.setTileTypeFromXY = function(x,y, type) {
        this.grid[this.toGrid(y)][this.toGrid(x)] = type
    }

    this.toGrid = function(i) {
        return Math.floor(i / this.tileSize);
    }

    this.toPixel = function(i) {
        return (i * this.tileSize);
    }

    this.toPixels = function(gridX, gridY) {
        return [this.toPixel(gridX), this.toPixel(gridX)];
    }

    this.render = function() {
        for(var y = 0; y < this.grid.length; y++) {
            for (var x = 0 ; x < this.grid[y].length; x++) {
                if (this.bitmapKeys.indexOf( this.grid[y][x].toString() ) !== -1) { // Its an image
                    image(this.selectedMap.tiles[this.grid[y][x]], this.toPixel(x), this.toPixel(y));
                } else {
                    fill(0,255,0, 100);
                    rect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }

            }
        }
    }
}
