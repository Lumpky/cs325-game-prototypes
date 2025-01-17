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
    backgroundColor: '#2a2a55',
    parent: 'game',
    pixelArt: true,
    roundPixels: false,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var controls;
var activeRoom;
var dungeon;
var map;
var player;
var keyW;
var keyA;
var keyS;
var keyD;
var cursors;
var player;
var lastMoveTime = 0;
var cam;
var layer;
var enemy1 = null;
var enemy2 = null;
var enemy3 = null;
var enemy4 = null;
var enemy5 = null;
var enemy6 = null;
var enemyCount = 6;
var coins;
var fame = 0;
var fameText;

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
var debug = false;

// Tile index mapping to make the code more readable
var TILES = {
    TOP_LEFT_WALL: 3,
    TOP_RIGHT_WALL: 4,
    BOTTOM_RIGHT_WALL: 23,
    BOTTOM_LEFT_WALL: 22,
    TOP_WALL: [
        { index: 39, weight: 4 },
        { index: 57, weight: 1 },
        { index: 58, weight: 1 },
        { index: 59, weight: 1 }
    ],
    LEFT_WALL: [
        { index: 21, weight: 4 },
        { index: 76, weight: 1 },
        { index: 95, weight: 1 },
        { index: 114, weight: 1 }
    ],
    RIGHT_WALL: [
        { index: 19, weight: 4 },
        { index: 77, weight: 1 },
        { index: 96, weight: 1 },
        { index: 115, weight: 1 }
    ],
    BOTTOM_WALL: [
        { index: 1, weight: 4 },
        { index: 78, weight: 1 },
        { index: 79, weight: 1 },
        { index: 80, weight: 1 }
    ],
    FLOOR: [
        { index: 6, weight: 20 },
        { index: 7, weight: 1 },
        { index: 8, weight: 1 },
        { index: 26, weight: 1 },
    ]
};

function preload ()
{
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponser)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/buch-dungeon-tileset-extruded.png');
    this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
    this.load.spritesheet('mummy', 'assets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    this.load.spritesheet('fant_tiles', 'assets/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
}

function create ()
{
    // Animations
    this.anims.create({
        key: 'guardStart',
        frames: this.anims.generateFrameNames('knight', { prefix: 'guard_start/frame', start: 0, end: 3, zeroPad: 4 }),
        frameRate: 8
    });

    this.anims.create({
        key: 'guard',
        frames: this.anims.generateFrameNames('knight', { prefix: 'guard/frame', start: 0, end: 5, zeroPad: 4 }),
        frameRate: 8,
        repeat: 2
    });

    this.anims.create({
        key: 'guardEnd',
        frames: this.anims.generateFrameNames('knight', { prefix: 'guard_end/frame', start: 0, end: 3, zeroPad: 4 }),
        frameRate: 8
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
        frameRate: 8,
        repeat: -1
    });

    const attackConfig = {
        key: 'attack',
        frames: this.anims.generateFrameNames('knight', { prefix: 'attack_C/frame', start: 0, end: 13, zeroPad: 4 }),
        frameRate: 16,
        repeat: 0
    };

    this.anims.create(attackConfig);

    const config = {
        key: 'move',
        frames: this.anims.generateFrameNumbers('mummy', {frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]}),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    };

    this.anims.create(config);

    const coinConfig = {
        key: 'coin',
        frames: this.anims.generateFrameNumbers('fant_tiles', { start: 42, end: 47 }),
        frameRate: 12,
        repeat: 0
    };

    this.anims.create(coinConfig);

    // Note: Dungeon is not a Phaser element - it's from the custom script embedded at the bottom :)
    // It generates a simple set of connected rectangular rooms that then we can turn into a tilemap

    //  2,500 tile test
    // dungeon = new Dungeon({
    //     width: 50,
    //     height: 50,
    //     rooms: {
    //         width: { min: 7, max: 15, onlyOdd: true },
    //         height: { min: 7, max: 15, onlyOdd: true }
    //     }
    // });

    //  40,000 tile test
    dungeon = new Dungeon({
        width: 200,
        height: 200,
        rooms: {
            width: { min: 7, max: 20, onlyOdd: true },
            height: { min: 7, max: 20, onlyOdd: true }
        }
    });

    //  250,000 tile test!
    // dungeon = new Dungeon({
    //     width: 500,
    //     height: 500,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // });

    //  1,000,000 tile test! - Warning, takes a few seconds to generate the dungeon :)
    // dungeon = new Dungeon({
    //     width: 1000,
    //     height: 1000,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // });

    // Creating a blank tilemap with dimensions matching the dungeon
    map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: dungeon.width, height: dungeon.height });

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)

    var tileset = map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2);

    layer = map.createBlankLayer('Layer 1', tileset);

    if (!debug)
    {
        layer.setScale(3);
    }

    // Fill with black tiles
    layer.fill(20);

    // Use the array of rooms generated to place tiles in the map
    dungeon.rooms.forEach(function (room) {
        var x = room.x;
        var y = room.y;
        var w = room.width;
        var h = room.height;
        var cx = Math.floor(x + w / 2);
        var cy = Math.floor(y + h / 2);
        var left = x;
        var right = x + (w - 1);
        var top = y;
        var bottom = y + (h - 1);

        // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
        // See "Weighted Randomize" example for more information on how to use weightedRandomize.
        map.weightedRandomize(TILES.FLOOR, x, y, w, h);

        // Place the room corners tiles
        map.putTileAt(TILES.TOP_LEFT_WALL, left, top);
        map.putTileAt(TILES.TOP_RIGHT_WALL, right, top);
        map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom);
        map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom);

        // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
        map.weightedRandomize(TILES.TOP_WALL, left + 1, top, w - 2, 1);
        map.weightedRandomize(TILES.BOTTOM_WALL, left + 1, bottom, w - 2, 1);
        map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, h - 2);
        map.weightedRandomize(TILES.RIGHT_WALL, right, top + 1, 1, h - 2);

        // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
        var doors = room.getDoorLocations();

        for (var i = 0; i < doors.length; i++)
        {
            map.putTileAt(6, x + doors[i].x, y + doors[i].y);
        }

        // Place some random stuff in rooms occasionally
        var rand = Math.random();
        if (rand <= 0.25)
        {
            layer.putTileAt(166, cx, cy); // Chest
        }
        else if (rand <= 0.3)
        {
            layer.putTileAt(81, cx, cy); // Stairs
        }
        else if (rand <= 0.4)
        {
            layer.putTileAt(167, cx, cy); // Trap door
        }
        else if (rand <= 0.6)
        {
            if (room.height >= 9)
            {
                // We have room for 4 towers
                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx - 1, cy + 1);

                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx + 1, cy + 1);

                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx - 1, cy - 2);

                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx + 1, cy - 2);
            }
            else
            {
                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx - 1, cy - 1);

                layer.putTilesAt([
                    [ 186 ],
                    [ 205 ]
                ], cx + 1, cy - 1);
            }
        }
    });

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    layer.setCollisionByExclusion([ 6, 7, 8, 26 ]);

    // Hide all the rooms
    if (!debug)
    {
        layer.forEachTile(function (tile) { tile.alpha = 0; });
    }

    // Place the player in the first room
    var playerRoom = dungeon.rooms[0];

    var lancelot = this.add.sprite(playerRoom.x + 1, playerRoom.y + 1)

    lancelot.setOrigin(0.2, 0.5);
    lancelot.setScale(1.5);
    lancelot.play('idle');
    
    player = lancelot;

    player.x = map.tileToWorldX(playerRoom.x + 1);
    player.y = map.tileToWorldY(playerRoom.y + 1);

    // Creates the enemies in the game
    for (var i = 0; i < dungeon.rooms.length; i++)
    {
        var room = dungeon.rooms[i];
        var tile = layer.getTileAt(Math.floor(room.x + room.width / 2), Math.floor(room.y + room.height / 2));

        if (tile.index == 167)
        {
            if (enemyCount == 6)
            {
                enemy1 = this.add.sprite(tile.x, tile.y);

                enemy1.setOrigin(0, 0);
                enemy1.setScale(1.5);
                enemy1.play('move');
                enemy1.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                    
                enemy1.setInteractive();

                enemy1.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy1.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy1.destroy();

                });

                enemy1.x = map.tileToWorldX(tile.x);
                enemy1.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }

            if (enemyCount == 5)
            {
                enemy2 = this.add.sprite(tile.x, tile.y);

                enemy2.setOrigin(0, 0);
                enemy2.setScale(1.5);
                enemy2.play('move');
                enemy2.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                    
                enemy2.setInteractive();

                enemy2.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy2.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy2.destroy();

                });

                enemy2.x = map.tileToWorldX(tile.x);
                enemy2.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }

            if (enemyCount == 4)
            {
                enemy3 = this.add.sprite(tile.x, tile.y);

                enemy3.setOrigin(0, 0);
                enemy3.setScale(1.5);
                enemy3.play('move');
                enemy3.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                
                enemy3.setInteractive();

                enemy3.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy3.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy3.destroy();

                });

                enemy3.x = map.tileToWorldX(tile.x);
                enemy3.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }

            if (enemyCount == 3)
            {
                enemy4 = this.add.sprite(tile.x, tile.y);

                enemy4.setOrigin(0, 0);
                enemy4.setScale(1.5);
                enemy4.play('move');
                enemy4.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                    
                enemy4.setInteractive();

                enemy4.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy4.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy4.destroy();

                });

                enemy4.x = map.tileToWorldX(tile.x);
                enemy4.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }

            if (enemyCount == 2)
            {
                enemy5 = this.add.sprite(tile.x, tile.y);

                enemy5.setOrigin(0, 0);
                enemy5.setScale(1.5);
                enemy5.play('move');
                enemy5.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                    
                enemy5.setInteractive();

                enemy5.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy5.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy5.destroy();

                });

                enemy5.x = map.tileToWorldX(tile.x);
                enemy5.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }

            if (enemyCount == 1)
            {
                enemy6 = this.add.sprite(tile.x, tile.y);

                enemy6.setOrigin(0, 0);
                enemy6.setScale(1.5);
                enemy6.play('move');
                enemy6.setAlpha(0.0);
                //console.log(enemy1.x);
                //console.log(enemy1.y);
                    
                enemy6.setInteractive();

                enemy6.on('pointerdown', function () {

                    this.setTint(0xff0000);

                });

                enemy6.on('pointerup', function () {

                    fame++;
                    this.clearTint();
                    enemy6.destroy();

                });

                enemy6.x = map.tileToWorldX(tile.x);
                enemy6.y = map.tileToWorldY(tile.y);
                enemyCount--;
                continue;
            }
        }
    }

    if (!debug)
    {
        setRoomAlpha(playerRoom, 1); // Make the starting room visible
    }

    this.input.on('pointerdown', function (pointer) {

        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        player.play('attack');
        var temp = layer.getTileAt(Math.floor(activeRoom.x + activeRoom.width / 2), Math.floor(activeRoom.y + activeRoom.height / 2));
        var x = map.worldToTileX(worldPoint.x);
        var y = map.worldToTileY(worldPoint.y);

        if (temp.index == 166)
        {
            if (x == temp.x && y == temp.y)
            {
                coins = this.add.sprite(temp.x, temp.y);
                coins.setOrigin(0, 0);
                coins.setScale(1.25);
                coins.play('coin');
                fame++;
                coins.x = map.tileToWorldX(temp.x);
                coins.y = map.tileToWorldY(temp.y);

                this.tweens.add({
                    targets: coins,
                    props: {
                        y: {
                            value: -128,
                            ease: 'Linear',
                            duration: 8000,
                        },
                        x: {
                            value: '+=64',
                            ease: 'Sine.inOut',
                            duration: 250,
                            yoyo: true,
                            repeat: 1
                        }
                    },
                    onComplete: function () {
                        coins.destroy();
                    }
                });
            }
        }

    }, this);

    // Scroll to the player
    cam = this.cameras.main;

    cam.setBounds(0, 0, layer.width * layer.scaleX, layer.height * layer.scaleY);
    cam.scrollX = player.x - cam.width * 0.5;
    cam.scrollY = player.y - cam.height * 0.5;

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    cursors = this.input.keyboard.createCursorKeys();

    var help = this.add.text(16, 16, 'Arrows keys or WASD to move', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });

    help.setScrollFactor(0);

    fameText = this.add.text(16, 50, 'Fame: 0', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });

    fameText.setScrollFactor(0);
}

function update (time, delta)
{
    updatePlayerMovement(time);

    var playerTileX = map.worldToTileX(player.x);
    var playerTileY = map.worldToTileY(player.y);
    //console.log(playerTileX + ' ' + playerTileY);

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    var room = dungeon.getRoomAt(playerTileX, playerTileY);

    // If the player has entered a new room, make it visible and dim the last room
    if (room && activeRoom && activeRoom !== room)
    {
        if (!debug)
        {
            setRoomAlpha(room, 1);
            setRoomAlpha(activeRoom, 0.5);

            if (enemy1 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy1.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy1.y))
                {
                    enemy1.setAlpha(1);
                }
            }

            if (enemy2 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy2.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy2.y))
                {
                    enemy2.setAlpha(1);
                }
            }

            if (enemy3 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy3.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy3.y))
                {
                    enemy3.setAlpha(1);
                }
            }

            if (enemy4 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy4.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy4.y))
                {
                    enemy4.setAlpha(1);
                }
            }

            if (enemy5 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy5.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy5.y))
                {
                    enemy5.setAlpha(1);
                }
            }

            if (enemy6 != null)
            {
                if (Math.floor(room.x + room.width / 2) == map.worldToTileX(enemy6.x) && Math.floor(room.y + room.height / 2) == map.worldToTileY(enemy6.y))
                {
                    enemy6.setAlpha(1);
                }
            }
        }
    }

    activeRoom = room;

    fameText.setText('Fame: ' + fame);

    if (fame >= 10)
    {
        var winText = this.add.text(200, 300, 'You win! You are the most famous knight of all!', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#ffffff',
            fill: '#000000'
        });

        winText.setScrollFactor(0);
    }

    // Smooth follow the player
    var smoothFactor = 0.9;

    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (player.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (player.y - cam.height * 0.5);
}

function setRoomAlpha(room, alpha)
{
    map.forEachTile(function (tile) {
        tile.alpha = alpha;
    }, this, room.x, room.y, room.width, room.height)
}

function isTileOpenAt (worldX, worldY)
{
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    var tile = map.getTileAtWorldXY(worldX, worldY, true);

    if (tile && !tile.collides)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function updatePlayerMovement (time)
{
    var tw = map.tileWidth * layer.scaleX;
    var th = map.tileHeight * layer.scaleY;
    var repeatMoveDelay = 100;

    if (time > lastMoveTime + repeatMoveDelay) {
        if (cursors.down.isDown || keyS.isDown)
        {
            if (isTileOpenAt(player.x, player.y + th))
            {
                player.y += th;
                lastMoveTime = time;
            }
        }
        else if (cursors.up.isDown || keyW.isDown)
        {
            if (isTileOpenAt(player.x, player.y - th))
            {
                player.y -= th;
                lastMoveTime = time;
            }
        }

        if (cursors.left.isDown || keyA.isDown)
        {
            if (isTileOpenAt(player.x - tw, player.y))
            {
                player.x -= tw;
                lastMoveTime = time;
            }
        }
        else if (cursors.right.isDown || keyD.isDown)
        {
            if (isTileOpenAt(player.x + tw, player.y))
            {
                player.x += tw;
                lastMoveTime = time;
            }
        }
    }
}

// Minified & modified dungeon generator at mikewesthad/dungeon (fork of nickgravelyn/dungeon)
!function(t,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof exports?exports.Dungeon=o():t.Dungeon=o()}("undefined"!=typeof self?self:this,function(){return function(t){function o(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,o),i.l=!0,i.exports}var e={};return o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},o.p="",o(o.s=1)}([function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var r={EMPTY:0,WALL:1,FLOOR:2,DOOR:3};o.default=r},function(t,o,e){"use strict";t.exports=e(2).default},function(t,o,e){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(o,"__esModule",{value:!0});var n=function(){function t(t,o){var e=[],r=!0,i=!1,n=void 0;try{for(var h,a=t[Symbol.iterator]();!(r=(h=a.next()).done)&&(e.push(h.value),!o||e.length!==o);r=!0);}catch(t){i=!0,n=t}finally{try{!r&&a.return&&a.return()}finally{if(i)throw n}}return e}return function(o,e){if(Array.isArray(o))return o;if(Symbol.iterator in Object(o))return t(o,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),h=function(){function t(t,o){for(var e=0;e<o.length;e++){var r=o[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(o,e,r){return e&&t(o.prototype,e),r&&t(o,r),o}}(),a=e(3),s=e(4),u=r(s),f=e(0),l=r(f),d=e(5),m={width:50,height:50,rooms:{width:{min:5,max:15,onlyOdd:!1,onlyEven:!1},height:{min:5,max:15,onlyOdd:!1,onlyEven:!1},maxArea:150,maxRooms:50}},c=function(){function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,t);var e=o.rooms||{};e.width=Object.assign({},m.rooms.width,e.width),e.height=Object.assign({},m.rooms.height,e.height),e.maxArea=e.maxArea||m.rooms.maxArea,e.maxRooms=e.maxRooms||m.rooms.maxRooms,e.width.min<3&&(e.width.min=3),e.height.min<3&&(e.height.min=3),e.width.max<e.width.min&&(e.width.max=e.width.min),e.height.max<e.height.min&&(e.height.max=e.height.min);var r=e.width.min*e.height.min;e.maxArea<r&&(e.maxArea=r),this.width=o.width||m.width,this.height=o.height||m.height,this.roomConfig=e,this.rooms=[],this.roomGrid=[],this.generate(),this.tiles=this.getTiles()}return h(t,[{key:"drawToConsole",value:function(t){(0,d.debugMap)(this,t)}},{key:"generate",value:function(){this.rooms=[],this.roomGrid=[];for(var t=0;t<this.height;t++){this.roomGrid.push([]);for(var o=0;o<this.width;o++)this.roomGrid[t].push([])}var e=this.createRandomRoom();e.setPosition(Math.floor(this.width/2)-Math.floor(e.width/2),Math.floor(this.height/2)-Math.floor(e.height/2)),this.addRoom(e);for(var r=5*this.roomConfig.maxRooms;this.rooms.length<this.roomConfig.maxRooms&&r>0;)this.generateRoom(),r-=1;for(var i=0;i<this.rooms.length;i++)for(var h=this.getPotentiallyTouchingRooms(this.rooms[i]),a=0;a<h.length;a++)if(!this.rooms[i].isConnectedTo(h[a])&&Math.random()<.2){var s=this.findNewDoorLocation(this.rooms[i],h[a]),u=n(s,2),f=u[0],l=u[1];this.addDoor(f),this.addDoor(l)}}},{key:"getRoomAt",value:function(t,o){return t<0||o<0||t>=this.width||o>=this.height?null:this.roomGrid[o][t][0]}},{key:"getMappedTiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t=Object.assign({},{empty:0,wall:1,floor:2,door:3},t),this.tiles.map(function(o){return o.map(function(o){return o===l.default.EMPTY?t.empty:o===l.default.WALL?t.wall:o===l.default.FLOOR?t.floor:o===l.default.DOOR?t.door:void 0})})}},{key:"addRoom",value:function(t){if(!this.canFitRoom(t))return!1;this.rooms.push(t);for(var o=t.top;o<=t.bottom;o++)for(var e=t.left;e<=t.right;e++)this.roomGrid[o][e].push(t);return!0}},{key:"canFitRoom",value:function(t){if(t.x<0||t.x+t.width>this.width-1)return!1;if(t.y<0||t.y+t.height>this.height-1)return!1;for(var o=0;o<this.rooms.length;o++)if(t.overlaps(this.rooms[o]))return!1;return!0}},{key:"createRandomRoom",value:function(){var t=0,o=0,e=0,r=this.roomConfig;do{t=(0,a.randomInteger)(r.width.min,r.width.max,{onlyEven:r.width.onlyEven,onlyOdd:r.width.onlyOdd}),o=(0,a.randomInteger)(r.height.min,r.height.max,{onlyEven:r.height.onlyEven,onlyOdd:r.height.onlyOdd}),e=t*o}while(e>r.maxArea);return new u.default(t,o)}},{key:"generateRoom",value:function(){for(var t=this.createRandomRoom(),o=150;o>0;){var e=this.findRoomAttachment(t);if(t.setPosition(e.x,e.y),this.addRoom(t)){var r=this.findNewDoorLocation(t,e.target),i=n(r,2),h=i[0],a=i[1];this.addDoor(h),this.addDoor(a);break}o-=1}}},{key:"getTiles",value:function(){for(var t=Array(this.height),o=0;o<this.height;o++){t[o]=Array(this.width);for(var e=0;e<this.width;e++)t[o][e]=l.default.EMPTY}for(var r=0;r<this.rooms.length;r++)for(var i=this.rooms[r],n=0;n<i.height;n++)for(var h=0;h<i.width;h++)t[n+i.y][h+i.x]=i.tiles[n][h];return t}},{key:"getPotentiallyTouchingRooms",value:function(t){for(var o=[],e=function(e,r,i){for(var n=i[r][e],h=0;h<n.length;h++)if(n[h]!=t&&o.indexOf(n[h])<0){var a=e-n[h].x,s=r-n[h].y;(a>0&&a<n[h].width-1||s>0&&s<n[h].height-1)&&o.push(n[h])}},r=t.x+1;r<t.x+t.width-1;r++)e(r,t.y,this.roomGrid),e(r,t.y+t.height-1,this.roomGrid);for(var i=t.y+1;i<t.y+t.height-1;i++)e(t.x,i,this.roomGrid),e(t.x+t.width-1,i,this.roomGrid);return o}},{key:"findNewDoorLocation",value:function(t,o){var e={x:-1,y:-1},r={x:-1,y:-1};return t.y===o.y-t.height?(e.x=r.x=(0,a.randomInteger)(Math.floor(Math.max(o.left,t.left)+1),Math.floor(Math.min(o.right,t.right)-1)),e.y=t.y+t.height-1,r.y=o.y):t.x==o.x-t.width?(e.x=t.x+t.width-1,r.x=o.x,e.y=r.y=(0,a.randomInteger)(Math.floor(Math.max(o.top,t.top)+1),Math.floor(Math.min(o.bottom,t.bottom)-1))):t.x==o.x+o.width?(e.x=t.x,r.x=o.x+o.width-1,e.y=r.y=(0,a.randomInteger)(Math.floor(Math.max(o.top,t.top)+1),Math.floor(Math.min(o.bottom,t.bottom)-1))):t.y==o.y+o.height&&(e.x=r.x=(0,a.randomInteger)(Math.floor(Math.max(o.left,t.left)+1),Math.floor(Math.min(o.right,t.right)-1)),e.y=t.y,r.y=o.y+o.height-1),[e,r]}},{key:"findRoomAttachment",value:function(t){var o=(0,a.randomPick)(this.rooms),e=0,r=0;switch((0,a.randomInteger)(0,3)){case 0:e=(0,a.randomInteger)(o.left+2-(t.width-1),o.right-2),r=o.top-t.height;break;case 1:e=o.left-t.width,r=(0,a.randomInteger)(o.top+2-(t.height-1),o.bottom-2);break;case 2:e=o.right+1,r=(0,a.randomInteger)(o.top+2-(t.height-1),o.bottom-2);break;case 3:e=(0,a.randomInteger)(o.left+2-(t.width-1),o.right-2),r=o.bottom+1}return{x:e,y:r,target:o}}},{key:"addDoor",value:function(t){for(var o=this.roomGrid[t.y][t.x],e=0;e<o.length;e++){var r=o[e],i=t.x-r.x,n=t.y-r.y;r.tiles[n][i]=l.default.DOOR}}}]),t}();o.default=c},function(t,o,e){"use strict";function r(t,o){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=e.onlyOdd,h=void 0!==r&&r,a=e.onlyEven,s=void 0!==a&&a;return h?n(t,o):s?i(t,o):Math.floor(Math.random()*(o-t+1)+t)}function i(t,o){t%2!=0&&t<o&&t++,o%2!=0&&o>t&&o--;var e=(o-t)/2;return 2*Math.floor(Math.random()*(e+1))+t}function n(t,o){t%2==0&&t++,o%2==0&&o--;var e=(o-t)/2;return 2*Math.floor(Math.random()*(e+1))+t}function h(t){return t[r(0,t.length-1)]}Object.defineProperty(o,"__esModule",{value:!0}),o.randomInteger=r,o.randomEvenInteger=i,o.randomOddInteger=n,o.randomPick=h},function(t,o,e){"use strict";function r(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(o,"__esModule",{value:!0});var i=function(){function t(t,o){for(var e=0;e<o.length;e++){var r=o[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(o,e,r){return e&&t(o.prototype,e),r&&t(o,r),o}}(),n=e(0),h=function(t){return t&&t.__esModule?t:{default:t}}(n),a=function(){function t(o,e){r(this,t),this.width=o,this.height=e,this.setPosition(0,0),this.doors=[],this.tiles=[];for(var i=0;i<this.height;i++){for(var n=[],a=0;a<this.width;a++)0==i||i==this.height-1||0==a||a==this.width-1?n.push(h.default.WALL):n.push(h.default.FLOOR);this.tiles.push(n)}}return i(t,[{key:"setPosition",value:function(t,o){this.x=t,this.y=o,this.left=t,this.right=t+(this.width-1),this.top=o,this.bottom=o+(this.height-1),this.centerX=t+Math.floor(this.width/2),this.centerY=o+Math.floor(this.height/2)}},{key:"getDoorLocations",value:function(){for(var t=[],o=0;o<this.height;o++)for(var e=0;e<this.width;e++)this.tiles[o][e]==h.default.DOOR&&t.push({x:e,y:o});return t}},{key:"overlaps",value:function(t){return!(this.right<t.left)&&(!(this.left>t.right)&&(!(this.bottom<t.top)&&!(this.top>t.bottom)))}},{key:"isConnectedTo",value:function(t){for(var o=this.getDoorLocations(),e=0;e<o.length;e++){var r=o[e];if(r.x+=this.x,r.y+=this.y,r.x-=t.x,r.y-=t.y,!(r.x<0||r.x>t.width-1||r.y<0||r.y>t.height-1)&&t.tiles[r.y][r.x]==h.default.DOOR)return!0}return!1}}]),t}();o.default=a},function(t,o,e){"use strict";function r(t){var o=t.roomGrid.map(function(t){return t.map(function(t){return(""+t.length).padStart(2)})});console.log(o.map(function(t){return t.join(" ")}).join("\n"))}function i(t){var o,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e=Object.assign({},{empty:" ",emptyColor:"rgb(0, 0, 0)",wall:"#",wallColor:"rgb(255, 0, 0)",floor:"_",floorColor:"rgb(210, 210, 210)",door:".",doorColor:"rgb(0, 0, 255)",fontSize:"15px"},e);for(var r="",i=[],n=0;n<t.height;n+=1){for(var a=0;a<t.width;a+=1){var s=t.tiles[n][a];s===h.default.EMPTY?(r+="%c"+e.empty,i.push("color: "+e.emptyColor+"; font-size: "+e.fontSize)):s===h.default.WALL?(r+="%c"+e.wall,i.push("color: "+e.wallColor+"; font-size: "+e.fontSize)):s===h.default.FLOOR?(r+="%c"+e.floor,i.push("color: "+e.floorColor+"; font-size: "+e.fontSize)):s===h.default.DOOR&&(r+="%c"+e.door,i.push("color: "+e.doorColor+"; font-size: "+e.fontSize)),r+=" "}r+="\n"}(o=console).log.apply(o,[r].concat(i))}Object.defineProperty(o,"__esModule",{value:!0}),o.debugRoomGrid=r,o.debugMap=i;var n=e(0),h=function(t){return t&&t.__esModule?t:{default:t}}(n)}])});
