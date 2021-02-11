import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'game',
    pixelArt: true,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var light;
var player;
var layer;
var cursors;
var sibling1;
var sibling1_x;
var sibling1_y;
var sibling2;
var sibling2_x;
var sibling2_y;
var sibling3;
var sibling3_x;
var sibling3_y;
var score;
var found;
var timerText;
var timer;
var gameText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', [ 'assets/drawtiles1.png', 'assets/drawtiles1_n.png' ]);
    this.load.image('oldest', 'assets/player.png');
    this.load.image('sibling1', 'assets/sibling1.jpg');
    this.load.image('sibling2', 'assets/sibling2.jpg');
    this.load.image('sibling3', 'assets/sibling3.jpg');
    this.load.tilemapCSV('map', 'assets/grid.csv');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

    layer = map.createLayer(0, tileset, 0, 0).setPipeline('Light2D');

    player = this.add.image(32+16, 32+16, 'oldest');

    sibling1_x = 32 + 16;
    sibling1_y = (32 * 3) + 16;
    sibling1 = this.add.image(sibling1_x, sibling1_y, 'sibling1');
    sibling1.setAlpha(0.0);

    sibling2_x = (32 * 17) + 16;
    sibling2_y = (32 * 14) + 16;
    sibling2 = this.add.image(sibling2_x, sibling2_y, 'sibling2');
    sibling2.setAlpha(0.0);

    sibling3_x = (32 * 16) + 16;
    sibling3_y = (32 * 7) + 16;
    sibling3 = this.add.image(sibling3_x, sibling3_y, 'sibling3');
    sibling3.setAlpha(0.0);

    cursors = this.input.keyboard.createCursorKeys();

    light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0);

    this.lights.enable().setAmbientColor(0x555555);

    found = 0;
    score = this.add.text(8, 8, '', { font: '16px Arial', fill: '#ffffff' });

    timerText = this.add.text(700, 8, '', { font: '16px Arial', fill: '#ffffff' });
    timer = this.time.addEvent({ delay: 30000, callback: this.winOrLose, callBackScope: this });

    gameText = this.add.text(25, 200, '', { font: '42px Arial', fill: '#ffffff' });
}

function checkForSibling() 
{
    if (sibling1) {
        var s1xlow = sibling1.x - 96;
        var s1xhigh = sibling1.x + 96;
        var s1ylow = sibling1.y - 96;
        var s1yhigh = sibling1.y + 96;
    }

    if (sibling2) {
        var s2xlow = sibling2.x - 96;
        var s2xhigh = sibling2.x + 96;
        var s2ylow = sibling2.y - 96;
        var s2yhigh = sibling2.y + 96;
    }

    if (sibling3) {
        var s3xlow = sibling3.x - 96;
        var s3xhigh = sibling3.x + 96;
        var s3ylow = sibling3.y - 96;
        var s3yhigh = sibling3.y + 96;
    }

    if (sibling1) {
        if ((player.x >= s1xlow) && (player.x <= s1xhigh)) {
            if ((player.y >= s1ylow) && (player.y <= s1yhigh)) {
                sibling1.setAlpha(1.0);
            }
        }
    }

    if (sibling2) {
        if ((player.x >= s2xlow) && (player.x <= s2xhigh)) {
            if ((player.y >= s2ylow) && (player.y <= s2yhigh)) {
                sibling2.setAlpha(1.0);
            }
        }
    }

    if (sibling3) {
        if ((player.x >= s3xlow) && (player.x <= s3xhigh)) {
            if ((player.y >= s3ylow) && (player.y <= s3yhigh)) {
                sibling3.setAlpha(1.0);
            }
        }
    }
}

function checkFound()
{
    if (sibling1) {
        if ((player.x == sibling1.x) && (player.y == sibling1.y)) {
            found++;
            sibling1.destroy();
            sibling1 = null;
        }
    }
    
    if (sibling2) {
        if ((player.x == sibling2.x) && (player.y == sibling2.y)) {
            found++;
            sibling2.destroy();
            sibling2 = null;
        }
    }

    if (sibling3) {
        if ((player.x == sibling3.x) && (player.y == sibling3.y)) {
            found++;
            sibling3.destroy();
            sibling3 = null;
        }
    }
}

function update ()
{
    if (this.input.keyboard.checkDown(cursors.left, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x -= 32;
            player.angle = 180;
        }

        checkForSibling();
    }
    else if (this.input.keyboard.checkDown(cursors.right, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x += 32;
            player.angle = 0;
        }

        checkForSibling();
    }
    else if (this.input.keyboard.checkDown(cursors.up, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y -= 32;
            player.angle = -90;
        }

        checkForSibling();
    }
    else if (this.input.keyboard.checkDown(cursors.down, 100))
    {
        var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y += 32;
            player.angle = 90;
        }

        checkForSibling();
    }

    checkFound();

    if (found == 3) {
        winOrLose();
    }

    if (30000 - timer.getElapsed() <= 0) {
        winOrLose();
    }

    light.x = player.x;
    light.y = player.y;

    var index = 0;

    score.setText('Found: ' + found);

    if (timerText) {
        timerText.setText('Time ' + Math.floor(30000 - timer.getElapsed()));
    }
}

function winOrLose() 
{
    if (found == 3) {
        gameText.setText('YOU FOUND YOUR SIBLINGS!\nYOU WIN!');
    }
    else {
        gameText.setText('YOU DID NOT FIND YOUR SIBLINGS!\nYOU LOSE!');
    }

    if (timerText) { 
        timerText.destroy();
    }

    timerText = null;
}