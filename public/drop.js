function Drop(x, y) {
    this.x = x;
    this.y = y;

    this.show = function() {
        fill(150, 0, 250);
        ellipse(this.x, this.y, 50, 50);
    }

    this.move = function(dir) {
        this.x += dir;
    }
}