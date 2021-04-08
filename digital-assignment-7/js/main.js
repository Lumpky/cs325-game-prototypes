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
var keyR;
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

// Health of player
var hp = 10;

// Text displaying health
var hptext;

// Keeps track of spells and powerups
var spell = 0;
var spell1;
var spell2;
var spellTrack = 2;
var powerup = 0;
var powerup1;
var powerup2;
var powerTrack = 2;
var heal1;
var heal2;
var healTrack = 2;

var lastx = 250;
var lasty = 450;

var Scene0 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene0 ()
    {
        Phaser.Scene.call(this, { key: 'scene0' });
    },

    preload: function ()
    {
        this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
        this.load.tilemapTiledJSON('map1', 'assets/super-mario.json');
        this.load.image('tiles1', 'assets/super-mario.png');
        this.load.spritesheet('mummy', 'assets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    },

    create: function ()
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
        lancelot = this.physics.add.sprite(lastx, lasty)

        // Defines the scale and other aspects of the player icon.
        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(2);
        lancelot.play('idle');

        // Adds the enemies' icons to the game.
        enemy1 = this.physics.add.sprite(900, 320)

        // Defines the scale and other aspects of the enemies' icons.
        enemy1.setOrigin(0.5, 1);
        enemy1.setScale(2);
        enemy1.play('move');

        enemy2 = this.physics.add.sprite(1500, 475)
        enemy2.setOrigin(0.5, 1);
        enemy2.setScale(2);
        enemy2.play('move');

        enemy3 = this.physics.add.sprite(2250, 525)
        enemy3.setOrigin(0.5, 1);
        enemy3.setScale(2);
        enemy3.play('move');

        enemy4 = this.physics.add.sprite(2750, 525)
        enemy4.setOrigin(0.5, 1);
        enemy4.setScale(2);
        enemy4.play('move');

        boss = this.physics.add.sprite(3275, 525)
        boss.setOrigin(0.5, 1);
        boss.setScale(4);
        boss.play('move');

        // Adds the platforms that can be jumped on.
        var ground = new Phaser.GameObjects.Rectangle(this, 0, 475, 6750, 36);
        var platform1 = new Phaser.GameObjects.Rectangle(this, 900, 324, 200, 36);
        var grounde = new Phaser.GameObjects.Rectangle(this, 0, 520, 6750, 36)
        var platform1e = new Phaser.GameObjects.Rectangle(this, 900, 360, 200, 36);
        var platform2 = new Phaser.GameObjects.Rectangle(this, 3140, 324, 60, 36);

        var platforms = this.physics.add.staticGroup();

        platforms.add(ground);
        platforms.add(platform1);
        platforms.add(platform2);

        var enemy_platforms = this.physics.add.staticGroup();

        enemy_platforms.add(platform1e);
        enemy_platforms.add(grounde);

        this.physics.add.collider(lancelot, platforms);
        this.physics.add.collider(enemy1, enemy_platforms);
        this.physics.add.collider(enemy2, enemy_platforms);
        this.physics.add.collider(enemy3, enemy_platforms);
        this.physics.add.collider(enemy4, enemy_platforms);
        this.physics.add.collider(boss, enemy_platforms);

        this.physics.add.collider(
            lancelot, 
            enemy1,
            function() 
            {
                lastx = lancelot.x;
                lasty = lancelot.y;
                this.scene.start('scene1');
            },
            function()
            {
                return true;
            }, 
            this);

        this.physics.add.collider(
            lancelot, 
            enemy2,
            function() 
            {
                lastx = lancelot.x;
                lasty = lancelot.y;
                this.scene.start('scene2');
            },
            function()
            {
                return true;
            }, 
            this);

        this.physics.add.collider(
            lancelot, 
            enemy3,
            function() 
            {
                lastx = lancelot.x;
                lasty = lancelot.y;
                this.scene.start('scene3');
            },
            function()
            {
                return true;
            }, 
            this);

        this.physics.add.collider(
            lancelot, 
            enemy4,
            function() 
            {
                lastx = lancelot.x;
                lasty = lancelot.y;
                this.scene.start('scene4');
            },
            function()
            {
                return true;
            }, 
            this);

        this.physics.add.collider(
            lancelot, 
            boss,
            function() 
            {
                lastx = lancelot.x;
                lasty = lancelot.y;
                this.scene.start('scene5');
            },
            function()
            {
                return true;
            }, 
            this);

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

        }, this);

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

            //console.log(pointer.worldX + " " + pointer.worldY + "\n");

            lancelot.play('attack');

        }, this);

        hptext = this.add.text(16, 50, 'HP: 10', {
            fontFamily: 'Old English Text MT',
            fontSize: '24px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#000000'
        });

        hptext.setScrollFactor(0);

        //var spells = this.physics.add.staticGroup();
        spell1 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0x0000ff);
        spell2 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0x0000ff);

        powerup1 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0x00ffff);
        powerup2 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0x00ffff);

        heal1 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0xff0000);
        heal2 = this.add.rectangle(Phaser.Math.Between(251, 3190), 500, 25, 25, 0xff0000);
    },

    update: function (time, delta)
    {
        controls.update(delta);

        hptext.setText('HP: ' + hp + '\nSpells: ' + spell + '\nPowerups ' + powerup);

        if (hp <= 0) {
            this.scene.start('sceneL');
        }

        // Causes the player to fall down after jumping.
        if (curTime > 0) {
            curTime++;
        }
        if (curTime >= 25) {
            curTime = 0;
            jumping = false;
            //lancelot.y += 125;
        }

        // Causes the player to jump.
        if (cursors.up.isDown || keyW.isDown)
        {
            if (jumping == false) {
                jumping = true;
                lancelot.y -= 175;
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
            //jumping = false;
        }

        if (enemy1h <= 0 && enemy1 != null) {
            enemy1.destroy();
            enemy1 = null;
        }

        if (enemy2h <= 0 && enemy2 != null) {
            enemy2.destroy();
            enemy2 = null;
        }

        if (enemy3h <= 0 && enemy3 != null) {
            enemy3.destroy();
            enemy3 = null;
        }

        if (enemy4h <= 0 && enemy4 != null) {
            enemy4.destroy();
            enemy4 = null;
        }

        if (bossh <= 0 && boss != null) {
            boss.destroy();
            boss = null;
            this.scene.start('sceneW');
        }

        if (spell1 != null && spellTrack > 0)
        {
            if (lancelot.x >= spell1.x)
            {
                spell++;
                spellTrack--;
                spell1.destroy();
                spell1 = null;
            }
        }

        if (spell2 != null && spellTrack > 0)
        {
            if (lancelot.x >= spell2.x)
            {
                spell++;
                spellTrack--;
                spell2.destroy();
                spell2 = null;
            }
        }

        if (powerup1 != null && powerTrack > 0)
        {
            if (lancelot.x >= powerup1.x)
            {
                powerup++;
                powerTrack--;
                powerup1.destroy();
                powerup1 = null;
            }
        }

        if (powerup2 != null && powerTrack > 0)
        {
            if (lancelot.x >= powerup2.x)
            {
                powerup++;
                powerTrack--;
                powerup2.destroy();
                powerup2 = null;
            }
        }

        if (heal1 != null && healTrack > 0)
        {
            if (lancelot.x >= heal1.x)
            {
                hp += 5;
                healTrack--;
                if (hp > 10)
                {
                    hp = 10;
                }
                heal1.destroy();
                heal1 = null;
            }
        }

        if (heal2 != null && healTrack > 0)
        {
            if (lancelot.x >= heal2.x)
            {
                hp += 5;
                healTrack--;
                if (hp > 10)
                {
                    hp = 10;
                }
                heal2.destroy();
                heal2 = null;
            }
        }

        if (spellTrack == 0)
        {
            if (spell1 != null)
            {
                spell1.destroy();
                spell1 = null;
            }

            if (spell2 != null)
            {
                spell2.destroy();
                spell2 = null;
            }
        }
        
        if (powerTrack == 0) {
            if (powerup1 != null)
            {
                powerup1.destroy();
                powerup1 = null;
            }
            if (powerup2 != null)
            {
                powerup2.destroy();
                powerup2 = null;
            }
        }

        if (healTrack == 0) {
            if (heal1 != null)
            {
                heal1.destroy();
                heal1 = null;
            }
            if (heal2 != null)
            {
                heal2.destroy();
                heal2 = null;
            }
        }
    }

});

var Scene1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene1 ()
    {
        Phaser.Scene.call(this, { key: 'scene1' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/clouds.png');
        this.load.spritesheet('tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function ()
    {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        var lancelot1 = this.add.sprite(300, 536);

        lancelot1.setOrigin(0.5, 1);
        lancelot1.setScale(8);
        lancelot1.play('idle');

        var s1_enemy = this.add.sprite(600, 536);

        s1_enemy.setOrigin(0.5, 1);
        s1_enemy.setScale(6);
        s1_enemy.play('move');

        var b1 = this.add.rectangle(575, 100, 75, 50, 0x000000);
        b1.setInteractive();
        var b1t = this.add.text(540, 85, 'Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b2 = this.add.rectangle(660, 100, 75, 50, 0x000000);
        b2.setInteractive();
        var b2t = this.add.text(625, 85, 'Spell', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b3 = this.add.rectangle(615, 155, 75, 50, 0x000000);
        b3.setInteractive();
        var b3t = this.add.text(565, 140, 'Power Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '14px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        b1.on('pointerdown', function () {
            lancelot1.play('attack');
            s1_enemy.setTint(0xff0000);
            lancelot1.play('attack');
        });

        b1.on('pointerup', function () {
            enemy1h -= Phaser.Math.Between(1, 6);

            if (enemy1h > 0)
            {
                hp -= Phaser.Math.Between(1, 4);
            }
            s1_enemy.clearTint();
        });

        b2.on('pointerdown', function () {
            lancelot1.play('attack');
            if (spell > 0)
            {
                s1_enemy.setTint(0x0000ff);
            }
        });

        b2.on('pointerup', function () {
            if (spell > 0)
            {
                enemy1h -= Phaser.Math.Between(1, 8);
                spell--;

                if (enemy1h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s1_enemy.clearTint();
            }
        });

        b3.on('pointerdown', function () {
            lancelot1.play('attack');
            if (powerup > 0)
            {
                s1_enemy.setTint(0xff0000);
            }
        });

        b3.on('pointerup', function () {
            if (powerup > 0)
            {
                enemy1h -= Phaser.Math.Between(1, 6) + 1;
                powerup--;

                if (enemy1h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s1_enemy.clearTint();
            }
        });
    },

    update: function()
    {
        if (enemy1h <= 0)
        {
            this.scene.start('scene0');
        }
    }

});

var Scene2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene2 ()
    {
        Phaser.Scene.call(this, { key: 'scene2' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/clouds.png');
        this.load.spritesheet('tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function ()
    {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        var lancelot2 = this.add.sprite(300, 536);

        lancelot2.setOrigin(0.5, 1);
        lancelot2.setScale(8);
        lancelot2.play('idle');

        var s2_enemy = this.add.sprite(600, 536);

        s2_enemy.setOrigin(0.5, 1);
        s2_enemy.setScale(6);
        s2_enemy.play('move');

        var b1 = this.add.rectangle(575, 100, 75, 50, 0x000000);
        b1.setInteractive();
        var b1t = this.add.text(540, 85, 'Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b2 = this.add.rectangle(660, 100, 75, 50, 0x000000);
        b2.setInteractive();
        var b2t = this.add.text(625, 85, 'Spell', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b3 = this.add.rectangle(615, 155, 75, 50, 0x000000);
        b3.setInteractive();
        var b3t = this.add.text(565, 140, 'Power Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '14px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        b1.on('pointerdown', function () {
            lancelot2.play('attack');
            s2_enemy.setTint(0xff0000);
        });

        b1.on('pointerup', function () {
            enemy2h -= Phaser.Math.Between(1, 6);

            if (enemy2h > 0)
            {
                hp -= Phaser.Math.Between(1, 4);
            }
            s2_enemy.clearTint();
        });

        b2.on('pointerdown', function () {
            lancelot2.play('attack');
            if (spell > 0)
            {
                s2_enemy.setTint(0x0000ff);
            }
        });

        b2.on('pointerup', function () {
            if (spell > 0)
            {
                enemy2h -= Phaser.Math.Between(1, 8);
                spell--;

                if (enemy2h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s2_enemy.clearTint();
            }
        });

        b3.on('pointerdown', function () {
            lancelot2.play('attack');
            if (powerup > 0)
            {
                s2_enemy.setTint(0xff0000);
            }
        });

        b3.on('pointerup', function () {
            if (powerup > 0)
            {
                enemy2h -= Phaser.Math.Between(1, 6) + 1;
                powerup--;

                if (enemy2h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s2_enemy.clearTint();
            }
        });
    },

    update: function()
    {
        if (enemy2h <= 0)
        {
            this.scene.start('scene0');
        }
    }

});

var Scene3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene3 ()
    {
        Phaser.Scene.call(this, { key: 'scene3' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/clouds.png');
        this.load.spritesheet('tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function ()
    {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        var lancelot3 = this.add.sprite(300, 536);

        lancelot3.setOrigin(0.5, 1);
        lancelot3.setScale(8);
        lancelot3.play('idle');

        var s3_enemy = this.add.sprite(600, 536);

        s3_enemy.setOrigin(0.5, 1);
        s3_enemy.setScale(6);
        s3_enemy.play('move');

        var b1 = this.add.rectangle(575, 100, 75, 50, 0x000000);
        b1.setInteractive();
        var b1t = this.add.text(540, 85, 'Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b2 = this.add.rectangle(660, 100, 75, 50, 0x000000);
        b2.setInteractive();
        var b2t = this.add.text(625, 85, 'Spell', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b3 = this.add.rectangle(615, 155, 75, 50, 0x000000);
        b3.setInteractive();
        var b3t = this.add.text(565, 140, 'Power Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '14px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        b1.on('pointerdown', function () {
            lancelot3.play('attack');
            s3_enemy.setTint(0xff0000);
        });

        b1.on('pointerup', function () {
            enemy3h -= Phaser.Math.Between(1, 6);

            if (enemy3h > 0)
            {
                hp -= Phaser.Math.Between(1, 4);
            }
            s3_enemy.clearTint();
        });

        b2.on('pointerdown', function () {
            lancelot3.play('attack');
            if (spell > 0)
            {
                s3_enemy.setTint(0x0000ff);
            }
        });

        b2.on('pointerup', function () {
            if (spell > 0)
            {
                enemy3h -= Phaser.Math.Between(1, 8);
                spell--;

                if (enemy3h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s3_enemy.clearTint();
            }
        });

        b3.on('pointerdown', function () {
            lancelot3.play('attack');
            if (powerup > 0)
            {
                s3_enemy.setTint(0xff0000);
            }
        });

        b3.on('pointerup', function () {
            if (powerup > 0)
            {
                enemy3h -= Phaser.Math.Between(1, 6) + 1;
                powerup--;

                if (enemy3h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s3_enemy.clearTint();
            }
        });
    },

    update: function()
    {
        if (enemy3h <= 0)
        {
            this.scene.start('scene0');
        }
    }
    
});

var Scene4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene4 ()
    {
        Phaser.Scene.call(this, { key: 'scene4' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/clouds.png');
        this.load.spritesheet('tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function ()
    {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        var lancelot4 = this.add.sprite(300, 536);

        lancelot4.setOrigin(0.5, 1);
        lancelot4.setScale(8);
        lancelot4.play('idle');

        var s4_enemy = this.add.sprite(600, 536);

        s4_enemy.setOrigin(0.5, 1);
        s4_enemy.setScale(6);
        s4_enemy.play('move');

        var b1 = this.add.rectangle(575, 100, 75, 50, 0x000000);
        b1.setInteractive();
        var b1t = this.add.text(540, 85, 'Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b2 = this.add.rectangle(660, 100, 75, 50, 0x000000);
        b2.setInteractive();
        var b2t = this.add.text(625, 85, 'Spell', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b3 = this.add.rectangle(615, 155, 75, 50, 0x000000);
        b3.setInteractive();
        var b3t = this.add.text(565, 140, 'Power Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '14px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        b1.on('pointerdown', function () {
            lancelot4.play('attack');
            s4_enemy.setTint(0xff0000);
        });

        b1.on('pointerup', function () {
            enemy4h -= Phaser.Math.Between(1, 6);

            if (enemy4h > 0)
            {
                hp -= Phaser.Math.Between(1, 4);
            }
            s4_enemy.clearTint();
        });

        b2.on('pointerdown', function () {
            lancelot4.play('attack');
            if (spell > 0)
            {
                s4_enemy.setTint(0x0000ff);
            }
        });

        b2.on('pointerup', function () {
            if (spell > 0)
            {
                enemy4h -= Phaser.Math.Between(1, 8);
                spell--;

                if (enemy4h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s4_enemy.clearTint();
            }
        });

        b3.on('pointerdown', function () {
            lancelot4.play('attack');
            if (powerup > 0)
            {
                s4_enemy.setTint(0xff0000);
            }
        });

        b3.on('pointerup', function () {
            if (powerup > 0)
            {
                enemy4h -= Phaser.Math.Between(1, 6) + 1;
                powerup--;

                if (enemy4h > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s4_enemy.clearTint();
            }
        });
    },

    update: function()
    {
        if (enemy4h <= 0)
        {
            this.scene.start('scene0');
        }
    }
    
});

var Scene5 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene5 ()
    {
        Phaser.Scene.call(this, { key: 'scene5' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/clouds.png');
        this.load.spritesheet('tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function ()
    {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        var lancelot5 = this.add.sprite(300, 536);

        lancelot5.setOrigin(0.5, 1);
        lancelot5.setScale(8);
        lancelot5.play('idle');

        var s5_enemy = this.add.sprite(600, 536);

        s5_enemy.setOrigin(0.5, 1);
        s5_enemy.setScale(8);
        s5_enemy.play('move');

        var b1 = this.add.rectangle(575, 100, 75, 50, 0x000000);
        b1.setInteractive();
        var b1t = this.add.text(540, 85, 'Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b2 = this.add.rectangle(660, 100, 75, 50, 0x000000);
        b2.setInteractive();
        var b2t = this.add.text(625, 85, 'Spell', {
            fontFamily: 'Old English Text MT',
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        var b3 = this.add.rectangle(615, 155, 75, 50, 0x000000);
        b3.setInteractive();
        var b3t = this.add.text(565, 140, 'Power Attack', {
            fontFamily: 'Old English Text MT',
            fontSize: '14px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        b1.on('pointerdown', function () {
            lancelot5.play('attack');
            s5_enemy.setTint(0xff0000);
        });

        b1.on('pointerup', function () {
            bossh -= Phaser.Math.Between(1, 6);

            if (bossh > 0)
            {
                hp -= Phaser.Math.Between(1, 4);
            }
            s5_enemy.clearTint();
        });

        b2.on('pointerdown', function () {
            lancelot5.play('attack');
            if (spell > 0)
            {
                s5_enemy.setTint(0x0000ff);
            }
        });

        b2.on('pointerup', function () {
            if (spell > 0)
            {
                bossh -= Phaser.Math.Between(1, 8);
                spell--;

                if (bossh > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s5_enemy.clearTint();
            }
        });

        b3.on('pointerdown', function () {
            lancelot5.play('attack');
            if (powerup > 0)
            {
                s5_enemy.setTint(0xff0000);
            }
        });

        b3.on('pointerup', function () {
            if (powerup > 0)
            {
                bossh -= Phaser.Math.Between(1, 6) + 1;
                powerup--;

                if (bossh > 0)
                {
                    hp -= Phaser.Math.Between(1, 4);
                }
                s5_enemy.clearTint();
            }
        });
    },

    update: function()
    {
        if (bossh <= 0)
        {
            this.scene.start('scene0');
        }
    }
    
});

var SceneW = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneW ()
    {
        Phaser.Scene.call(this, { key: 'sceneW' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        var win = this.add.text(50, 300, 'You Win! You are the Side Hero!\nPress \'r\' to play again!', {
            fontFamily: 'Old English Text MT',
            fontSize: '48px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });
        win.setScrollFactor(0);

        this.input.keyboard.on('keydown-R', function () {

            spell = 0;
            spellTrack = 2;
            powerup = 0;
            powerTrack = 2;
            healTrack = 2;
            hp = 10;
            lastx = 250;
            lasty = 450;
            enemy1h = 4;
            enemy2h = 4;
            enemy3h = 4;
            enemy4h = 4;
            bossh = 10;
            running = false;
            jumping = false;
            this.scene.start('scene0')

        }, this);
    }

});

var SceneL = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneL ()
    {
        Phaser.Scene.call(this, { key: 'sceneL' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        var lose = this.add.text(50, 300, 'You Lose! The Undead Defeated You!\n Press \'r\' to try again!', {
            fontFamily: 'Old English Text MT',
            fontSize: '48px',
            padding: { x: 10, y: 5 },
            //backgroundColor: '#ffffff',
            fill: '#ffffff'
        });

        lose.setScrollFactor(0);

        this.input.keyboard.on('keydown-R', function () {

            spell = 0;
            spellTrack = 2;
            powerup = 0;
            powerTrack = 2;
            healTrack = 2;
            hp = 10;
            lastx = 250;
            lasty = 450;
            enemy1h = 4;
            enemy2h = 4;
            enemy3h = 4;
            enemy4h = 4;
            bossh = 10;
            running = false;
            jumping = false;
            this.scene.start('scene0')
        }, this);
    }
});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: false
        }
    },
    scene: [ Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, SceneW, SceneL ]
};

// The game with its configurations passed in.
var game = new Phaser.Game(config);