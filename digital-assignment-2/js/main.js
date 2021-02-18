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

//class Oasis extends Phaser.Scene
//{
//    constructor ()
//    {
//        super();
//    }

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var movingPlatform1;
var movingPlatform2;
var movingPlatform3;
var movingPlatform4;
var movingPlatform5;
var movingPlatform6;
var movingPlatform7;
var movingPlatform8;
var movingPlatform9;
var movingPlatform10;
var movingPlatform11;
var movingPlatform12;
var movingPlatform13;
var movingPlatform14;
var movingPlatform15;
var movingPlatform16;
var movingPlatform17;
var movingPlatform18;
var movingPlatform19;
var winText;
var o1 = 0;
var o2 = 0;
var o3 = 0;
var o4 = 0;
var o5 = 0;

const game = new Phaser.Game(config);

function preload ()
    {
        this.load.image('map', 'assets/earthbound-scarab.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

function create ()
    {
        this.cameras.main.setBounds(0, 0, 800, 2048);

        this.add.image(0, 0, 'map').setOrigin(0);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 2048);

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 2048, 'platform').setScale(2).refreshBody();

        movingPlatform1 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1858, 1958), 'platform');
        movingPlatform2 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1758, 1800), 'platform');
        movingPlatform3 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1658, 1700), 'platform');
        movingPlatform4 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1558, 1600), 'platform');
        movingPlatform5 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1458, 1500), 'platform');
        movingPlatform6 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1358, 1400), 'platform');
        movingPlatform7 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1258, 1300), 'platform');
        movingPlatform8 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1158, 1200), 'platform');
        movingPlatform9 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(1058, 1100), 'platform');
        movingPlatform10 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(958, 1000), 'platform');
        movingPlatform11 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(858, 900), 'platform');
        movingPlatform12 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(758, 800), 'platform');
        movingPlatform13 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(658, 700), 'platform');
        movingPlatform14 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(558, 600), 'platform');
        movingPlatform15 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(458, 500), 'platform');
        movingPlatform16 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(358, 400), 'platform');
        movingPlatform17 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(258, 300), 'platform');
        movingPlatform18 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(158, 200), 'platform');
        movingPlatform19 = this.physics.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(58, 100), 'platform');

        movingPlatform1.setImmovable(true);
        movingPlatform1.body.allowGravity = false;
        movingPlatform1.setVelocityX(50);
        movingPlatform2.setImmovable(true);
        movingPlatform2.body.allowGravity = false;
        movingPlatform2.setVelocityX(50);
        movingPlatform3.setImmovable(true);
        movingPlatform3.body.allowGravity = false;
        movingPlatform3.setVelocityX(50);
        movingPlatform4.setImmovable(true);
        movingPlatform4.body.allowGravity = false;
        movingPlatform4.setVelocityX(50);
        movingPlatform5.setImmovable(true);
        movingPlatform5.body.allowGravity = false;
        movingPlatform5.setVelocityX(50);
        movingPlatform6.setImmovable(true);
        movingPlatform6.body.allowGravity = false;
        movingPlatform6.setVelocityX(50);
        movingPlatform7.setImmovable(true);
        movingPlatform7.body.allowGravity = false;
        movingPlatform7.setVelocityX(50);
        movingPlatform8.setImmovable(true);
        movingPlatform8.body.allowGravity = false;
        movingPlatform8.setVelocityX(50);
        movingPlatform9.setImmovable(true);
        movingPlatform9.body.allowGravity = false;
        movingPlatform9.setVelocityX(50);
        movingPlatform10.setImmovable(true);
        movingPlatform10.body.allowGravity = false;
        movingPlatform10.setVelocityX(50);
        movingPlatform11.setImmovable(true);
        movingPlatform11.body.allowGravity = false;
        movingPlatform11.setVelocityX(50);
        movingPlatform12.setImmovable(true);
        movingPlatform12.body.allowGravity = false;
        movingPlatform12.setVelocityX(50);
        movingPlatform13.setImmovable(true);
        movingPlatform13.body.allowGravity = false;
        movingPlatform13.setVelocityX(50);
        movingPlatform14.setImmovable(true);
        movingPlatform14.body.allowGravity = false;
        movingPlatform14.setVelocityX(50);
        movingPlatform15.setImmovable(true);
        movingPlatform15.body.allowGravity = false;
        movingPlatform15.setVelocityX(50);
        movingPlatform16.setImmovable(true);
        movingPlatform16.body.allowGravity = false;
        movingPlatform16.setVelocityX(50);
        movingPlatform17.setImmovable(true);
        movingPlatform17.body.allowGravity = false;
        movingPlatform17.setVelocityX(50);
        movingPlatform18.setImmovable(true);
        movingPlatform18.body.allowGravity = false;
        movingPlatform18.setVelocityX(50);
        movingPlatform19.setImmovable(true);
        movingPlatform19.body.allowGravity = false;
        movingPlatform19.setVelocityX(50);

        player = this.physics.add.sprite(400, 1950, 'player');
        // player = this.add.image(400, 2048, 'player');

        this.cameras.main.startFollow(player, true, 0.09, 0.09);

        player.setBounce(0.2);
        //player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, movingPlatform1);
        this.physics.add.collider(player, movingPlatform2);
        this.physics.add.collider(player, movingPlatform3);
        this.physics.add.collider(player, movingPlatform4);
        this.physics.add.collider(player, movingPlatform5);
        this.physics.add.collider(player, movingPlatform6);
        this.physics.add.collider(player, movingPlatform7);
        this.physics.add.collider(player, movingPlatform8);
        this.physics.add.collider(player, movingPlatform9);
        this.physics.add.collider(player, movingPlatform10);
        this.physics.add.collider(player, movingPlatform11);
        this.physics.add.collider(player, movingPlatform12);
        this.physics.add.collider(player, movingPlatform13);
        this.physics.add.collider(player, movingPlatform14);
        this.physics.add.collider(player, movingPlatform15);
        this.physics.add.collider(player, movingPlatform16);
        this.physics.add.collider(player, movingPlatform17);
        this.physics.add.collider(player, movingPlatform18);
        this.physics.add.collider(player, movingPlatform19);

        winText = this.add.text(350, 250, '', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' });
    }

function update ()
    {
        const cam = this.cameras.main;

        if (player.y <= 0)
        {
            winText.setText('You Won!\n');
        }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            console.log(o1);
            console.log(o2);
            console.log(o3);
            console.log(o4);
            console.log(o5);
            if (o1 || o2 || o3 || o4 || o5)
            {
                o1 = 0;
                o2 = 0;
                o3 = 0;
                o4 = 0;
                o5 = 0;
                
                player.setVelocityY(-630);
            }
            player.setVelocityY(-330);
        }

        if (movingPlatform1.x >= 500)
        {
            movingPlatform1.setVelocityX(-50);
        }
        else if (movingPlatform1.x <= 300)
        {
            movingPlatform1.setVelocityX(50);
        }

        if (movingPlatform2.x >= 500)
        {
            movingPlatform2.setVelocityX(-50);
        }
        else if (movingPlatform2.x <= 300)
        {
            movingPlatform2.setVelocityX(50);
        }

        if (movingPlatform3.x >= 500)
        {
            movingPlatform3.setVelocityX(-50);
        }
        else if (movingPlatform3.x <= 300)
        {
            movingPlatform3.setVelocityX(50);
        }

        if (movingPlatform4.x >= 500)
        {
            movingPlatform4.setVelocityX(-50);
        }
        else if (movingPlatform4.x <= 300)
        {
            movingPlatform4.setVelocityX(50);
        }

        if (movingPlatform5.x >= 500)
        {
            movingPlatform5.setVelocityX(-50);
        }
        else if (movingPlatform5.x <= 300)
        {
            movingPlatform5.setVelocityX(50);
        }

        if (movingPlatform6.x >= 500)
        {
            movingPlatform6.setVelocityX(-50);
        }
        else if (movingPlatform6.x <= 300)
        {
            movingPlatform6.setVelocityX(50);
        }

        if (movingPlatform7.x >= 500)
        {
            movingPlatform7.setVelocityX(-50);
        }
        else if (movingPlatform7.x <= 300)
        {
            movingPlatform7.setVelocityX(50);
        }

        if (movingPlatform8.x >= 500)
        {
            movingPlatform8.setVelocityX(-50);
        }
        else if (movingPlatform8.x <= 300)
        {
            movingPlatform8.setVelocityX(50);
        }

        if (movingPlatform9.x >= 500)
        {
            movingPlatform9.setVelocityX(-50);
        }
        else if (movingPlatform9.x <= 300)
        {
            movingPlatform9.setVelocityX(50);
        }

        if (movingPlatform10.x >= 500)
        {
            movingPlatform10.setVelocityX(-50);
        }
        else if (movingPlatform10.x <= 300)
        {
            movingPlatform10.setVelocityX(50);
        }

        if (movingPlatform11.x >= 500)
        {
            movingPlatform11.setVelocityX(-50);
        }
        else if (movingPlatform11.x <= 300)
        {
            movingPlatform11.setVelocityX(50);
        }

        if (movingPlatform12.x >= 500)
        {
            movingPlatform12.setVelocityX(-50);
        }
        else if (movingPlatform12.x <= 300)
        {
            movingPlatform12.setVelocityX(50);
        }

        if (movingPlatform13.x >= 500)
        {
            movingPlatform13.setVelocityX(-50);
        }
        else if (movingPlatform13.x <= 300)
        {
            movingPlatform13.setVelocityX(50);
        }

        if (movingPlatform14.x >= 500)
        {
            movingPlatform14.setVelocityX(-50);
        }
        else if (movingPlatform14.x <= 300)
        {
            movingPlatform14.setVelocityX(50);
        }

        if (movingPlatform15.x >= 500)
        {
            movingPlatform15.setVelocityX(-50);
        }
        else if (movingPlatform15.x <= 300)
        {
            movingPlatform15.setVelocityX(50);
        }

        if (movingPlatform16.x >= 500)
        {
            movingPlatform16.setVelocityX(-50);
        }
        else if (movingPlatform16.x <= 300)
        {
            movingPlatform16.setVelocityX(50);
        }

        if (movingPlatform17.x >= 500)
        {
            movingPlatform17.setVelocityX(-50);
        }
        else if (movingPlatform17.x <= 300)
        {
            movingPlatform17.setVelocityX(50);
        }

        if (movingPlatform18.x >= 500)
        {
            movingPlatform18.setVelocityX(-50);
        }
        else if (movingPlatform18.x <= 300)
        {
            movingPlatform18.setVelocityX(50);
        }

        if (movingPlatform19.x >= 500)
        {
            movingPlatform19.setVelocityX(-50);
        }
        else if (movingPlatform19.x <= 300)
        {
            movingPlatform19.setVelocityX(50);
        }

        if (player.y >= 1558 && player.y <= 1600)
        {
            o1 = 1;
            if (o1)
            {
                if (cursors.up.isDown && player.body.touching.down)
                {
                    player.setVelocityY(-630);
                }
            }
        }

        if (player.y >= 758 && player.y <= 800)
        {
            o2 = 1;
            if (o2)
            {
                if (cursors.up.isDown && player.body.touching.down)
                {
                    player.setVelocityY(-630);
                }
            }
        }

        if (player.y >= 358 && player.y <= 400)
        {
            o3 = 1;
            if (o3)
            {
                if (cursors.up.isDown && player.body.touching.down)
                {
                    player.setVelocityY(-630);
                }
            }
        }

        if (player.y >= 258 && player.y <= 300)
        {
            o4 = 1;
            if (o4)
            {
                if (cursors.up.isDown && player.body.touching.down)
                {
                    player.setVelocityY(-630);
                }
            }
        }

        if (player.y >= 158 && player.y <= 200)
        {
            o5 = 1;
            if (o5)
            {
                if (cursors.up.isDown && player.body.touching.down)
                {
                    player.setVelocityY(-630);
                }
            }
        }
    }
//}