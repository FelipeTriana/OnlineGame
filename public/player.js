function Player(x) {
    this.x = x;
    this.y = height / 2;
    this.velocityy = 4;
    this.w = 80;
    this.h = 80;
    this.points = 0;

    this.show = function() {
        //     rectMode(CENTER);
        //     rect(this.x, this.y, this.w, this.h)
        image(img, this.x, this.y, this.w, this.h);
    }




    this.move = function() {

        if (p.y < mouseY)
            p.y += p.velocityy;
        else if (p.y > mouseY)
            p.y -= p.velocityy;

    }

}

function preload() {
    img = loadImage('images/hamstersito.png');
    img2 = loadImage('images/hamstersito2.png');
}