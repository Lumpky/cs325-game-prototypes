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
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game',
    pixelArt: false,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// The camera controls.
var controls;
// The player's sprite.
var lancelot;
// The keyboard cursors.
var cursors;
// The movement keys other than the arrow keys.
var keyW;
var keyA;
var keyS;
var keyD;
// Checks to see if the character is running, jumping or not.
var running = false;
var jumping = false;
// Keeps track of when the player should fall.
var curTime = 0;
// Enemies throughout the level.
var enemy1;
var enemy2;
var enemy3;
var enemy4;
var boss;

// Health of enemies
var enemy1h = 4;
var enemy2h = 4;
var enemy3h = 4;
var enemy4h = 4;
var bossh = 10;

var hp = 10;

var hptext;

// The game with its configurations passed in.
var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
    this.load.tilemapTiledJSON('map1', 'assets/super-mario.json');
    this.load.image('tiles1', 'assets/super-mario.png');
    this.load.spritesheet('mummy', 'assets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
}

function create ()
{
    // Creates the map that will be played on.
    var map1 = this.make.tilemap({ key: 'map1' });
    // Adds the correct tileset to the map.
    var tileset1 = map1.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
    // Adds a layer in the world-space.
    var layer1 = map1.createLayer('World1', tileset1, 0, 0).setScale(2.5);

    // Initializes the cursors variable to the arrow keys.
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    cursors = this.input.keyboard.createCursorKeys();

    // Initializes the camera controls' configurations.
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };

    // Passes in the camera's control configurations.
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    // Sets the bounds of the camera.
    this.cameras.main.setBounds(0, 0, layer1.x + layer1.width, layer1.height * 3);

    // Defines the configuration of the running animation.
    const runConfig = {
        key: 'run',
        frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
        frameRate: 12,
        //repeat: -1
    };

    this.anims.create(runConfig);

    // Defines the configuration of the jumping animation.
    const jumpConfig = {
        key: 'jump_loop',
        frames: this.anims.generateFrameNames('knight', { prefix: 'jump_loop/frame', start: 0, end: 1, zeroPad: 4 }),
        frameRate: 4,
        //repeat: -1
    };

    this.anims.create(jumpConfig);

    // Creates the idle animation.
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
        frameRate: 8,
        repeat: -1
    });

    // Creates the mummy animation.
    const config = {
        key: 'move',
        frames: this.anims.generateFrameNumbers('mummy', {frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]}),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    };

    this.anims.create(config);

    const animConfig = {
        key: 'attack',
        frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
        frameRate: 12
    };

    this.anims.create(animConfig);

    // Adds the player icon to the game.
    lancelot = this.add.sprite(250, 525)

    // Defines the scale and other aspects of the player icon.
    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(2);
    lancelot.play('idle');

    // Adds the enemies' icons to the game.
    enemy1 = this.add.sprite(900, 370)

    // Defines the scale and other aspects of the enemies' icons.
    enemy1.setOrigin(0.5, 1);
    enemy1.setScale(2);
    enemy1.play('move');

    enemy2 = this.add.sprite(1500, 525)
    enemy2.setOrigin(0.5, 1);
    enemy2.setScale(2);
    enemy2.play('move');

    enemy3 = this.add.sprite(2250, 525)
    enemy3.setOrigin(0.5, 1);
    enemy3.setScale(2);
    enemy3.play('move');

    enemy4 = this.add.sprite(2750, 525)
    enemy4.setOrigin(0.5, 1);
    enemy4.setScale(2);
    enemy4.play('move');

    boss = this.add.sprite(3250, 525)
    boss.setOrigin(0.5, 1);
    boss.setScale(4);
    boss.play('move');

    // A handler that plays the correct animation once any animation finishes.
    lancelot.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {

        if (running) {
            lancelot.play('run');
        }
        else if (jumping) {
            lancelot.play('jump_loop');
        }
        else {
            lancelot.play('idle');
        }
    
    }, this);

    // Plays the running animation if the left arrow key is pressed.
    this.input.keyboard.on('keydown-LEFT', function () {

        lancelot.play('run');

    });

    // Plays the running animation if the right arrow key is pressed.
    this.input.keyboard.on('keydown-RIGHT', function () {

        lancelot.play('run');

    });

    // Plays the running animation if the A key is pressed.
    this.input.keyboard.on('keydown-A', function () {

        lancelot.play('run');

    });

    // Plays the running animation if the D key is pressed.
    this.input.keyboard.on('keydown-D', function () {

        lancelot.play('run');

    });

    // Plays the jumping animation if the W key is pressed.
    this.input.keyboard.on('keydown-UP', function () {

        lancelot.play('jump_loop');

    });

    // Plays the jumping animation if the W key is pressed.
    this.input.keyboard.on('keydown-W', function () {

        lancelot.play('jump_loop');

    });

    this.cameras.main.startFollow(lancelot, true, 0.09, 0.09);

    this.input.on('pointerdown', function (pointer) {
        
        if (lancelot.x <= enemy1.x - 5 && lancelot.y <= enemy1.y) {
            enemy1h -= Phaser.Math.Between(1, 6);

            if (enemy1h > 0) {
                hp -= Phaser.Math.Between(1, 4);
            }
        }

        else if (lancelot.x <= enemy2.x - 5 && lancelot.y <= enemy2.y) {
            enemy2h -= Phaser.Math.Between(1, 6);

            if (enemy2h > 0) {
                hp -= Phaser.Math.Between(1, 4);
            }
        }

        else if (lancelot.x <= enemy3.x - 5 && lancelot.y <= enemy3.y) {
            enemy3h -= Phaser.Math.Between(1, 6);

            if (enemy3h > 0) {
                hp -= Phaser.Math.Between(1, 4);
            }
        }

        else if (lancelot.x <= enemy4.x - 5 && lancelot.y <= enemy4.y) {
            enemy4h -= Phaser.Math.Between(1, 6);

            if (enemy4h > 0) {
                hp -= Phaser.Math.Between(1, 4);
            }
        }

        else if (lancelot.x <= boss.x - 5 && lancelot.y <= boss.y) {
            bossh -= Phaser.Math.Between(1, 6);

            if (bossh > 0) {
                hp -= Phaser.Math.Between(1, 4);
            }
        }

        lancelot.play('attack');

    }, this);

    hptext = this.add.text(16, 50, 'HP: 10', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });

    hptext.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);

    hptext.setText('HP: ' + hp);

    if (hp <= 0) {
        var lose = this.add.text(200, 300, 'You Lose! The Undead Defeated You!', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#ffffff',
            fill: '#000000'
        });

        lose.setScrollFactor(0);
    }

    // Causes the player to fall down after jumping.
    if (curTime > 0) {
        curTime++;
    }
    if (curTime >= 25) {
        curTime = 0;
        lancelot.y += 150;
    }

    // Causes the player to jump.
    if (cursors.up.isDown || keyW.isDown)
    {
        if (jumping == false) {
            jumping = true;
            lancelot.y -= 150;
            curTime++;
        }
    }

    // Moves the player to the left and right.
    else if (cursors.left.isDown || keyA.isDown)
    {
        running = true;
        lancelot.x -= 5;
    }
    else if (cursors.right.isDown || keyD.isDown)
    {
        running = true;
        lancelot.x += 5;
    }

    // Causes the player to be idle.
    else {
        running = false;
        jumping = false;
    }

    if (enemy1h <= 0) {
        enemy1.destroy();
    }

    if (enemy2h <= 0) {
        enemy2.destroy();
    }

    if (enemy3h <= 0) {
        enemy3.destroy();
    }

    if (enemy4h <= 0) {
        enemy4.destroy();
    }

    if (bossh <= 0) {
        var win = this.add.text(200, 300, 'You Win! You are the Side Hero!', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#ffffff',
            fill: '#000000'
        });
        win.setScrollFactor(0);
        boss.destroy();
    }
}