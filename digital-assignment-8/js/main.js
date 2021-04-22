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
    type: Phaser.Auto,
    width: 800,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Book shelf
var shelf;

// Hands
var lhand;
var rhand;

// Buttons
var pick_stack_l;
var place_stack_l;
var pick_right_l;
var place_right_l;
var pick_left_l;
var place_left_l;
var pick_stack_r;
var place_stack_r;
var pick_right_r;
var place_right_r;
var pick_left_r;
var place_left_r;

// These are the different books that are available 
var book1;
var book2;
var book3;
var book4;
var book5;
var book6;
var book7;
var book8;
var book9;
var book10;
var book11;
var book12;
var book13;
var book14;
var book15;
var book16;

// Array of stack of books
var stack = [];

// Array of books on right side
var right_side = [];

// Array of books on left side
var left_side = [];

// Book in left hand
var left_hand = null;

// Book in right hand
var right_hand = null;

// Whole shelf
var whole_shelf;

// Correct order of books
var answer = [];

// Timer
var timer;

// Text of timer
var timeText;

var game = new Phaser.Game(config);

function preload()
{
}

function create() 
{
    // Creates the shelf
    shelf = this.add.rectangle(400, 100, 27 * 16, 90, 0xf0f0f0);

    // Creates the hands
    var ltext = this.add.text(325, 225, 'Left hand').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
    var rtext = this.add.text(425, 225, 'Right hand').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
    lhand = this.add.rectangle(350, 300, 48, 90, 0x808080);
    rhand = this.add.rectangle(450, 300, 48, 90, 0x808080);

    // Creates the buttons for the left hand
    var left = this.add.text(300, 375, 'Left hand controls').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
    pick_stack_l = this.add.text(250, 400, 'Pick book up\nfrom stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_stack_l.setInteractive();
    place_stack_l = this.add.text(375, 400, 'Place book\non stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_stack_l.setInteractive();
    pick_right_l = this.add.text(250, 450, 'Pick book up\nfrom right side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_right_l.setInteractive();
    place_right_l = this.add.text(375, 450, 'Place book\non right side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_right_l.setInteractive();
    pick_left_l = this.add.text(250, 500, 'Pick book up\nfrom left side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_left_l.setInteractive();
    place_left_l = this.add.text(375, 500, 'Place book\non left side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_left_l.setInteractive();

    // Creates the buttons for the right hand
    var right = this.add.text(550, 375, 'Right hand controls').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
    pick_stack_r = this.add.text(500, 400, 'Pick book up\nfrom stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_stack_r.setInteractive();
    place_stack_r = this.add.text(625, 400, 'Place book\non stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_stack_r.setInteractive();
    pick_right_r = this.add.text(500, 450, 'Pick book up\nfrom right side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_right_r.setInteractive();
    place_right_r = this.add.text(625, 450, 'Place book\non right side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_right_r.setInteractive();
    pick_left_r = this.add.text(500, 500, 'Pick book up\nfrom left side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    pick_left_r.setInteractive();
    place_left_r = this.add.text(625, 500, 'Place book\non left side').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
    place_left_r.setInteractive();

    // Creates the books
    book1 = this.add.text(184, 55, 'Ar').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff0000').setPadding({x: 5, y: 35});
    left_side.push(book1);
    book2 = this.add.text(184 + 27, 55, 'Zy').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff00ff').setPadding({x: 5, y: 35});
    left_side.push(book2);
    book3 = this.add.text(184 + (27 * 2), 55, 'Ro').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#000f88').setPadding({x: 5, y: 35});
    left_side.push(book3);
    book4 = this.add.text(184 + (27 * 3), 55, 'Il').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#0000ff').setPadding({x: 5, y: 35});
    left_side.push(book4);
    book5 = this.add.text(16, 595, 'Pi').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffff00').setPadding({x: 5, y: 35});
    book5.angle = -90;
    stack.push(book5);
    book6 = this.add.text(16, 595 - 27, 'Tr').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#880000').setPadding({x: 5, y: 35});
    book6.angle = -90;
    stack.push(book6);
    book7 = this.add.text(16, 595 - (27 * 2), 'Qu').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#008800').setPadding({x: 5, y: 35});
    book7.angle = -90;
    stack.push(book7);
    book8 = this.add.text(16, 595 - (27 * 3), 'Za').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#000088').setPadding({x: 5, y: 35});
    book8.angle = -90;
    stack.push(book8);
    book9 = this.add.text(16, 595 - (27 * 4), 'Fr').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#327788').setPadding({x: 5, y: 35});
    book9.angle = -90;
    stack.push(book9);
    book10 = this.add.text(16, 595 - (27 * 5), 'Ii').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff3254').setPadding({x: 5, y: 35});
    book10.angle = -90;
    stack.push(book10);
    book11 = this.add.text(16, 595 - (27 * 6), 'Ut').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#790500').setPadding({x: 5, y: 35});
    book11.angle = -90;
    stack.push(book11);
    book12 = this.add.text(16, 595 - (27 * 7), 'Br').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#008501').setPadding({x: 5, y: 35});
    book12.angle = -90;
    stack.push(book12);
    book13 = this.add.text(16, 595 - (27 * 8), 'Rh').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff00aa').setPadding({x: 5, y: 35});
    book13.angle = -90;
    stack.push(book13);
    book14 = this.add.text(16, 595 - (27 * 9), 'Th').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ffbbcc').setPadding({x: 5, y: 35});
    book14.angle = -90;
    stack.push(book14);
    book15 = this.add.text(16, 595 - (27 * 10), 'Li').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ca000f').setPadding({x: 5, y: 35});
    book15.angle = -90;
    stack.push(book15);
    book16 = this.add.text(16, 595 - (27 * 11), 'Ma').setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#bb00da').setPadding({x: 5, y: 35});
    book16.angle = -90;
    stack.push(book16);

    answer.push(book1);
    answer.push(book12);
    answer.push(book9);
    answer.push(book10);
    answer.push(book4);
    answer.push(book15);
    answer.push(book16);
    answer.push(book5);
    answer.push(book7);
    answer.push(book13);
    answer.push(book3);
    answer.push(book14);
    answer.push(book6);
    answer.push(book11);
    answer.push(book8);
    answer.push(book2);

    // Useful for debugging
    this.input.on('pointerdown', function (pointer) {

        console.log(pointer.x);
        console.log(pointer.y);

    }, this);

    // Mouse input handlers for buttons that do things in the game
    pick_stack_l.on('pointerdown', function () {
        if (left_hand == null)
        {
            left_hand = stack.pop();
            left_hand.setPosition(332, 255);
            left_hand.angle += 90;
        }
    });

    place_stack_l.on('pointerdown', function () {
        if (left_hand != null)
        {
            var len = stack.length;
            left_hand.setPosition(16, 595 - (27 * len));
            left_hand.angle = -90;
            stack.push(left_hand);
            left_hand = null;
        }
    });

    pick_left_l.on('pointerdown', function () {
        if (left_hand == null)
        {
            left_hand = left_side.pop();
            left_hand.setPosition(332, 255);
        }
    });

    place_left_l.on('pointerdown', function () {
        if (left_hand != null)
        {
            var len = left_side.length;
            left_hand.setPosition(184 + (27 * len), 55);
            left_side.push(left_hand);
            left_hand = null;
        }
    });

    pick_right_l.on('pointerdown', function () {
        if (left_hand == null)
        {
            left_hand = right_side.pop();
            left_hand.setPosition(332, 255);
        }
    });

    place_right_l.on('pointerdown', function () {
        if (left_hand != null)
        {
            var len = right_side.length;
            left_hand.setPosition(615 - 27 - (27 * len), 55);
            right_side.push(left_hand);
            left_hand = null;
        }
    });

    pick_stack_r.on('pointerdown', function () {
        if (right_hand == null)
        {
            right_hand = stack.pop();
            right_hand.setPosition(432, 255);
            right_hand.angle += 90;
        }
    });

    place_stack_r.on('pointerdown', function () {
        if (right_hand != null)
        {
            var len = stack.length;
            right_hand.setPosition(16, 595 - (27 * len));
            right_hand.angle = -90;
            stack.push(right_hand);
            right_hand = null;
        }
    });

    pick_left_r.on('pointerdown', function () {
        if (right_hand == null)
        {
            right_hand = left_side.pop();
            right_hand.setPosition(432, 255);
        }
    });

    place_left_r.on('pointerdown', function () {
        if (right_hand != null)
        {
            var len = left_side.length;
            right_hand.setPosition(184 + (27 * len), 55);
            left_side.push(right_hand);
            right_hand = null;
        }
    });

    pick_right_r.on('pointerdown', function () {
        if (right_hand == null)
        {
            right_hand = right_side.pop();
            right_hand.setPosition(432, 255);
        }
    });

    place_right_r.on('pointerdown', function () {
        if (right_hand != null)
        {
            var len = right_side.length;
            right_hand.setPosition(615 - 27 - (27 * len), 55);
            right_side.push(right_hand);
            right_hand = null;
        }
    });

    timeText = this.add.text(700, 8, '', { font: '16px Arial', fill: '#ffffff' });
    timer = this.time.addEvent({ delay: 180000, callback: this.endTimer, callBackScope: this });
}

function update()
{
    var cur_answer = left_side.concat(right_side);

    if (cur_answer === answer)
    {
        var win = this.add.text(300, 200, 'You Win!');
    }

    timeText.setText('Time ' + Math.floor(180000 - timer.getElapsed()));
}

function endTimer()
{
    var cur_answer = left_side.concat(right_side);

    if (cur_answer != answer)
    {
        var lose = this.add.text(300, 200, 'You Lose!');
    }

}