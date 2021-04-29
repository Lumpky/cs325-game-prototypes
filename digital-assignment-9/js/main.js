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

// Book shelf
var shelf1;
var shelf2;

// Hands
var lhand;
var rhand;

// Buttons
var pick_stack_l;
var place_stack_l;
var pick_right_l1;
var place_right_l1;
var pick_left_l1;
var place_left_l1;
var pick_left_l2;
var place_left_l2;
var pick_right_l2;
var place_right_l2;
var pick_stack_r;
var place_stack_r;
var pick_right_r1;
var place_right_r1;
var pick_left_r1;
var place_left_r1;
var pick_left_r2;
var place_left_r2;
var pick_right_r2;
var place_right_r2;

// Array holding the books
var books = [];

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
var book17;
var book18;
var book19;
var book20;
var book21;
var book22;
var book23;
var book24;
var book25;
var book26;
var book27;
var book28;
var book29;
var book30;
var book31;
var book32;

// Array of stack of books
var stack = [];

// Array of books on right side of upper shelf
var right_side1 = [];

// Array of books on left side of upper shelf
var left_side1 = [];

// Array of books on right side of lower shelf
var right_side2 = [];

// Array of books on left side of lower shelf
var left_side2 = [];

// Book in left hand
var left_hand = null;

// Book in right hand
var right_hand = null;

// Correct order of books
var answer = [];

// Timer
var timer;

// Text of timer
var timeText;

var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainScene ()
    {
        Phaser.Scene.call(this, { key: 'mainScene' });
    },

    preload: function ()
    {
    },

    create: function () 
    {
        // Creates the shelf
        shelf1 = this.add.rectangle(450, 100, 27 * 32, 90, 0xf0f0f0);
        shelf2 = this.add.rectangle(450, 200, 27 * 32, 90, 0xf0f0f0);
    
        // Creates the hands
        var ltext = this.add.text(415, 350, 'Left hand').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
        var rtext = this.add.text(515, 350, 'Right hand').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
        lhand = this.add.rectangle(450, 425, 48, 90, 0x808080);
        rhand = this.add.rectangle(550, 425, 48, 90, 0x808080);
    
        // Creates the buttons for the left hand
        var left = this.add.text(350, 575, 'Left hand controls').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
        pick_stack_l = this.add.text(325, 600, 'Pick book up\nfrom stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_stack_l.setInteractive();
        place_stack_l = this.add.text(450, 600, 'Place book\non stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_stack_l.setInteractive();
        pick_right_l1 = this.add.text(325, 650, 'Pick book up\nfrom right side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_right_l1.setInteractive();
        place_right_l1 = this.add.text(450, 650, 'Place book\non right side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_right_l1.setInteractive();
        pick_left_l1 = this.add.text(325, 720, 'Pick book up\nfrom left side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_left_l1.setInteractive();
        place_left_l1 = this.add.text(450, 720, 'Place book\non left side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_left_l1.setInteractive();
        pick_right_l2 = this.add.text(325, 790, 'Pick book up\nfrom right side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_right_l2.setInteractive();
        place_right_l2 = this.add.text(450, 790, 'Place book up\nfrom right side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_right_l2.setInteractive();
        pick_left_l2 = this.add.text(325, 860, 'Pick book up\nfrom left side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_left_l2.setInteractive();
        place_left_l2 = this.add.text(450, 860, 'Place book up\nfrom left side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_left_l2.setInteractive();
    
        // Creates the buttons for the right hand
        var right = this.add.text(625, 575, 'Right hand controls').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffffff');
        pick_stack_r = this.add.text(600, 600, 'Pick book up\nfrom stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_stack_r.setInteractive();
        place_stack_r = this.add.text(725, 600, 'Place book\non stack').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_stack_r.setInteractive();
        pick_right_r1 = this.add.text(600, 650, 'Pick book up\nfrom right side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_right_r1.setInteractive();
        place_right_r1 = this.add.text(725, 650, 'Place book\non right side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_right_r1.setInteractive();
        pick_left_r1 = this.add.text(600, 720, 'Pick book up\nfrom left side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_left_r1.setInteractive();
        place_left_r1 = this.add.text(725, 720, 'Place book\non left side\non upper shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_left_r1.setInteractive();
        pick_right_r2 = this.add.text(600, 790, 'Pick book\non right side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_right_r2.setInteractive();
        place_right_r2 = this.add.text(725, 790, 'Place book\non right side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_right_r2.setInteractive();
        pick_left_r2 = this.add.text(600, 860, 'Pick book\non left side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        pick_left_r2.setInteractive();
        place_left_r2 = this.add.text(725, 860, 'Place book\non left side\non lower shelf').setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#888888');
        place_left_r2.setInteractive();
    
        // Creates the books
        book1 = this.add.text(18, 55, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff0000').setPadding({x: 5, y: 35});
        left_side1.push(book1);
        book2 = this.add.text(18 + 27, 55, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff00ff').setPadding({x: 5, y: 35});
        left_side1.push(book2);
        book3 = this.add.text(18 + (27 * 2), 55, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#000f88').setPadding({x: 5, y: 35});
        left_side1.push(book3);
        book4 = this.add.text(18 + (27 * 3), 55, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#0000ff').setPadding({x: 5, y: 35});
        left_side1.push(book4);
        book5 = this.add.text(18, 155, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#000000').setBackgroundColor('#ffff00').setPadding({x: 5, y: 35});
        left_side2.push(book5);
        book6 = this.add.text(18 + 27, 155, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#880000').setPadding({x: 5, y: 35});
        left_side2.push(book6);
        book7 = this.add.text(18 + (27 * 2), 155, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#008800').setPadding({x: 5, y: 35});
        left_side2.push(book7);
        book8 = this.add.text(18 + (27 * 3), 155, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#000088').setPadding({x: 5, y: 35});
        left_side2.push(book8);
        book9 = this.add.text(16, 995, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#327788').setPadding({x: 5, y: 35});
        book9.angle = -90;
        stack.push(book9);
        book10 = this.add.text(16, 995 - 27, String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff3254').setPadding({x: 5, y: 35});
        book10.angle = -90;
        stack.push(book10);
        book11 = this.add.text(16, 995 - (27 * 2), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#790500').setPadding({x: 5, y: 35});
        book11.angle = -90;
        stack.push(book11);
        book12 = this.add.text(16, 995 - (27 * 3), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#008501').setPadding({x: 5, y: 35});
        book12.angle = -90;
        stack.push(book12);
        book13 = this.add.text(16, 995 - (27 * 4), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff00aa').setPadding({x: 5, y: 35});
        book13.angle = -90;
        stack.push(book13);
        book14 = this.add.text(16, 995 - (27 * 5), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ffbbcc').setPadding({x: 5, y: 35});
        book14.angle = -90;
        stack.push(book14);
        book15 = this.add.text(16, 995 - (27 * 6), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ca000f').setPadding({x: 5, y: 35});
        book15.angle = -90;
        stack.push(book15);
        book16 = this.add.text(16, 995 - (27 * 7), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#bb00da').setPadding({x: 5, y: 35});
        book16.angle = -90;
        stack.push(book16);
        book17 = this.add.text(16, 995 - (27 * 8), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#123456').setPadding({x: 5, y: 35});
        book17.angle = -90;
        stack.push(book17);
        book18 = this.add.text(16, 995 - (27 * 9), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#456789').setPadding({x: 5, y: 35});
        book18.angle = -90;
        stack.push(book18);
        book19 = this.add.text(16, 995 - (27 * 10), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#789abc').setPadding({x: 5, y: 35});
        book19.angle = -90;
        stack.push(book19);
        book20 = this.add.text(16, 995 - (27 * 11), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#abcdef').setPadding({x: 5, y: 35});
        book20.angle = -90;
        stack.push(book20);
        book21 = this.add.text(16, 995 - (27 * 12), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#def000').setPadding({x: 5, y: 35});
        book21.angle = -90;
        stack.push(book21);
        book22 = this.add.text(16, 995 - (27 * 13), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#810fff').setPadding({x: 5, y: 35});
        book22.angle = -90;
        stack.push(book22);
        book23 = this.add.text(16, 995 - (27 * 14), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#2f847f').setPadding({x: 5, y: 35});
        book23.angle = -90;
        stack.push(book23);
        book24 = this.add.text(16, 995 - (27 * 15), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#aaa147').setPadding({x: 5, y: 35});
        book24.angle = -90;
        stack.push(book24);
        book25 = this.add.text(16, 995 - (27 * 16), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#0da369').setPadding({x: 5, y: 35});
        book25.angle = -90;
        stack.push(book25);
        book26 = this.add.text(16, 995 - (27 * 17), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#258369').setPadding({x: 5, y: 35});
        book26.angle = -90;
        stack.push(book26);
        book27 = this.add.text(16, 995 - (27 * 18), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ababab').setPadding({x: 5, y: 35});
        book27.angle = -90;
        stack.push(book27);
        book28 = this.add.text(16, 995 - (27 * 19), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#bbbbbb').setPadding({x: 5, y: 35});
        book28.angle = -90;
        stack.push(book28);
        book29 = this.add.text(16, 995 - (27 * 20), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#ff0024').setPadding({x: 5, y: 35});
        book29.angle = -90;
        stack.push(book29);
        book30 = this.add.text(16, 995 - (27 * 21), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#deef88').setPadding({x: 5, y: 35});
        book30.angle = -90;
        stack.push(book30);
        book31 = this.add.text(16, 995 - (27 * 22), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#fe1009').setPadding({x: 5, y: 35});
        book31.angle = -90;
        stack.push(book31);
        book32 = this.add.text(16, 995 - (27 * 23), String.fromCharCode(Phaser.Math.Between(65, 90), Phaser.Math.Between(97, 122))).setFontFamily('Arial').setFontSize(18).setColor('#ffffff').setBackgroundColor('#acc715').setPadding({x: 5, y: 35});
        book32.angle = -90;
        stack.push(book32);
    
        // Develop the correct ordering of books
        books = stack.concat(left_side1);
        books = books.concat(left_side2);
        
        // Defines the min and min_index variable
        var min;
        var min_index;
    
        // Generate the answer
        while (answer.length < 32)
        {
            // Find the first element that is not null
            for (var i = 0; i < books.length; i++)
            {
                if (books[i] != null)
                {
                    min = books[i];
                    min_index = i;
                    break;
                }
            }
    
            for (var i = 0; i < books.length; i++)
            {
                if (books[i] != null)
                {
                    if (books[i].text < min.text)
                    {
                        min = books[i];
                        min_index = i;
                    }
                }
    
                else
                {
                    continue;
                }
            }
            answer.push(min);
            books[min_index] = null;
        }
    
        // Useful for debugging
        /*console.log(answer.length);
        for (var i = 0; i < answer.length; i++)
        {
            console.log(answer[i].text);
        }*/
    
        // Useful for debugging
        this.input.on('pointerdown', function (pointer) {
    
            console.log(pointer.x);
            console.log(pointer.y);
    
        }, this);
    
        // Mouse input handlers for buttons that do things in the game
        pick_stack_l.on('pointerdown', function () {
            if (left_hand == null && stack.length > 0)
            {
                left_hand = stack.pop();
                left_hand.setPosition(432, 380);
                left_hand.angle += 90;
            }
        });
    
        place_stack_l.on('pointerdown', function () {
            if (left_hand != null)
            {
                var len = stack.length;
                left_hand.setPosition(16, 995 - (27 * len));
                left_hand.angle = -90;
                stack.push(left_hand);
                left_hand = null;
            }
        });
    
        pick_left_l1.on('pointerdown', function () {
            if (left_hand == null && left_side1.length > 0)
            {
                left_hand = left_side1.pop();
                left_hand.setPosition(432, 380);
            }
        });
    
        place_left_l1.on('pointerdown', function () {
            if (left_hand != null && left_hand.text < 'Ma')
            {
                var len = left_side1.length;
                left_hand.setPosition(18 + (27 * len), 55);
                left_side1.push(left_hand);
                left_hand = null;
            }
        });
    
        pick_right_l1.on('pointerdown', function () {
            if (left_hand == null && right_side1.length > 0)
            {
                left_hand = right_side1.pop();
                left_hand.setPosition(432, 380);
            }
        });
    
        place_right_l1.on('pointerdown', function () {
            if (left_hand != null && left_hand.text < 'Ma')
            {
                var len = right_side1.length;
                left_hand.setPosition(881 - 27 - (27 * len), 55);
                right_side1.push(left_hand);
                left_hand = null;
            }
        });
    
        pick_left_l2.on('pointerdown', function () {
            if (left_hand == null && left_side2.length > 0)
            {
                left_hand = left_side2.pop();
                left_hand.setPosition(432, 380);
            }
        });
    
        place_left_l2.on('pointerdown', function () {
            if (left_hand != null && left_hand.text >= 'Ma')
            {
                var len = left_side2.length;
                left_hand.setPosition(18 + (27 * len), 155);
                left_side2.push(left_hand);
                left_hand = null;
            }
        });
    
        pick_right_l2.on('pointerdown', function () {
            if (left_hand == null && right_side2.length > 0)
            {
                left_hand = right_side2.pop();
                left_hand.setPosition(432, 380);
            }
        });
    
        place_right_l2.on('pointerdown', function () {
            if (left_hand != null && left_hand.text >= 'Ma')
            {
                var len = right_side2.length;
                left_hand.setPosition(881 - 27 - (27 * len), 155);
                right_side2.push(left_hand);
                left_hand = null;
            }
        });
    
        pick_stack_r.on('pointerdown', function () {
            if (right_hand == null && stack.length > 0)
            {
                right_hand = stack.pop();
                right_hand.setPosition(532, 380);
                right_hand.angle += 90;
            }
        });
    
        place_stack_r.on('pointerdown', function () {
            if (right_hand != null)
            {
                var len = stack.length;
                right_hand.setPosition(16, 995 - (27 * len));
                right_hand.angle = -90;
                stack.push(right_hand);
                right_hand = null;
            }
        });
    
        pick_left_r1.on('pointerdown', function () {
            if (right_hand == null && left_side1.length > 0)
            {
                right_hand = left_side1.pop();
                right_hand.setPosition(532, 380);
            }
        });
    
        place_left_r1.on('pointerdown', function () {
            if (right_hand != null && right_hand.text < 'Ma')
            {
                var len = left_side1.length;
                right_hand.setPosition(18 + (27 * len), 55);
                left_side1.push(right_hand);
                right_hand = null;
            }
        });
    
        pick_right_r1.on('pointerdown', function () {
            if (right_hand == null && right_side1.length > 0)
            {
                right_hand = right_side1.pop();
                right_hand.setPosition(532, 380);
            }
        });
    
        place_right_r1.on('pointerdown', function () {
            if (right_hand != null && right_hand.text < 'Ma')
            {
                var len = right_side1.length;
                right_hand.setPosition(881 - 27 - (27 * len), 55);
                right_side1.push(right_hand);
                right_hand = null;
            }
        });
    
        pick_left_r2.on('pointerdown', function () {
            if (right_hand == null && left_side2.length > 0)
            {
                right_hand = left_side2.pop();
                right_hand.setPosition(532, 380);
            }
        });
    
        place_left_r2.on('pointerdown', function () {
            if (right_hand != null && right_hand.text >= 'Ma')
            {
                var len = left_side2.length;
                right_hand.setPosition(18 + (27 * len), 155);
                left_side2.push(right_hand);
                right_hand = null;
            }
        });
    
        pick_right_r2.on('pointerdown', function () {
            if (right_hand == null && right_side2.length > 0)
            {
                right_hand = right_side2.pop();
                right_hand.setPosition(532, 380);
            }
        });
    
        place_right_r2.on('pointerdown', function () {
            if (right_hand != null && right_hand.text >= 'Ma')
            {
                var len = right_side2.length;
                right_hand.setPosition(881 - 27 - (27 * len), 155);
                right_side2.push(right_hand);
                right_hand = null;
            }
        });
    
        timeText = this.add.text(700, 8, '', { font: '16px Arial', fill: '#ffffff' });
        timer = this.time.addEvent({ delay: 180000 });
    },

    update: function ()
    {
        var cur_answer = left_side1.concat(right_side1);
        cur_answer = cur_answer.concat(left_side2);
        cur_answer = cur_answer.concat(right_side2);
    
        if (cur_answer === answer)
        {
            var win = this.add.text(300, 200, 'Good work, I guess.\n Now get back to work!');
        }

        if (180000 - timer.getElapsed() <= 0)
        {
            if (cur_answer != answer)
            {
                var lose = this.add.text(300, 200, 'Hey! You haven\'t sorted these shelves properly!\nYou\'re terrible at this!');
            }
        }
    
        timeText.setText('Time ' + Math.floor(180000 - timer.getElapsed()));
    },
});

/*var WinScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WinScene ()
    {
        Phaser.Scene.call(this, { key: 'winScene' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
        var win = this.add.text(300, 200, 'Good work, I guess.\n Now get back to work!\nClick here to organize more shelves!');
        win.setInteractive();

        win.on('pointerdown', function () {
            this.scene.start('mainScene');
        });
    }

});*/

/*var LoseScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoseScene ()
    {
        Phaser.Scene.call(this, { key: 'loseScene' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
        var lose = this.add.text(300, 200, 'Hey! You haven\'t sorted these shelves properly!\nYou\'re terrible at this!\nClick here to redeem yourself!');
        lose.setInteractive();

        lose.on('pointerdown', function () {
            this.scene.start('mainScene');
        });
    }

});*/

var config = {
    type: Phaser.Auto,
    width: 900,
    height: 1000,
    parent: 'game',
    scene: [ MainScene ]
};

var game = new Phaser.Game(config);