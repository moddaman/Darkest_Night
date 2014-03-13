// Initialize Phaser, and creates a 400x490px game



//var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.AUTO, 'gameContainer');

var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game_div');
var bricks;
var cursors;
var lastCursorLeft;
var bird;
var score = 0;
var scoreLabel;
var superJumpsLabel;
var superJumps = 1;
var deathStar;
var killerSquare;
var killerSquares;
// Creates a new 'main' state that wil contain the game
var main_state = {


preload: function() {  
    // Change the background color of the game
    this.game.stage.backgroundColor = '#D6F9FF';


    // Load the bird sprite
    this.game.load.image('bird', 'assets/bird.png'); 

    this.game.load.image('pipe', 'assets/pipe.png');
    this.game.load.spritesheet('boy', 'assets/darknessBoy.png', 68, 122);
    this.game.load.image('beach', 'assets/beachStick.png');
    this.game.load.image('star', 'assets/deathStar.png');
  
},

create: function() {  

 

    this.game.world.setBounds(0, 0, 1800, 700);

    // Display the bird on the screen
    this.bird = this.game.add.sprite(0, 245, 'boy');

    // Add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;  
    this.bird.body.velocity.x = 0;
    //this.bird.body.bounce.y = 0.4;
    //this.bird.animations.add('right', [5, 6, 7, 8], 10, true);
    //this.bird.animations.add('left', [0, 1, 2, 3], 10, true);

    this.bird.animations.add('left', [0, 1, 2, 3], 10, true);
    this.bird.animations.add('right', [5, 6, 7, 8], 10, true);

    //Create pipes
    this.pipes = game.add.group();  
	this.pipes.createMultiple(20, 'pipe'); 

	//Timer
	this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);  

    bricks = game.add.group();
    this.add_plane(20, 450);
    this.add_plane(550, 450);
     this.add_plane(1000, 500);
    this.add_plane(1000, 190);
    this.add_plane(1550, 200);


     this.add_deathstar(450, 290);


      killerSquares = game.add.group();
      this.add_killer_square(1000, 180);


    scoreLabel = game.add.text(20, 20, "time: 0", { font: "15px Arial", fill: "#ff0000", align: "center" });
    scoreLabel.fixedToCamera = true;
    scoreLabel.cameraOffset.setTo(20, 20);

    superJumpsLabel = game.add.text(20, 40, "power jump: 1", { font: "15px Arial", fill: "#1f06fb", align: "center" });
    superJumpsLabel.fixedToCamera = true;
    superJumpsLabel.cameraOffset.setTo(20,40);      

    this.game.camera.follow(this.bird);
   //this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    // this.bird.body.collideWorldBounds = true;

    // Call the 'jump' function when the spacekey is hit
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(this.jump, this);
    cursors = game.input.keyboard.createCursorKeys();

    

},

update: function() {  

    
    //console.log(this.game.physics.collide(this.bird, this.bricks));
    this.game.physics.collide(this.bird, bricks);
    this.game.physics.collide(killerSquares, bricks);
	this.game.physics.overlap(this.bird, killerSquares, this.restart_game, null, this);  
    this.game.physics.overlap(this.bird, deathstar, this.collectDeathStar, null, this);
	this.bird.animations.play('right');
    // If the bird is out of the world (too high or too low), call the 'restart_game' function
    if (this.bird.inWorld == false)
        this.restart_game();

    killerSquare.body.velocity.x = -200;
    this.bird.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        lastCursorLeft = true;
        this.bird.body.velocity.x = -300;
        this.bird.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        lastCursorLeft = false;
        this.bird.body.velocity.x = 300;
        this.bird.animations.play('right');
    }
    else
    {
        this.bird.animations.stop();
        if(lastCursorLeft) {
            this.bird.frame = 0;
        } else {
            this.bird.frame = 9;
        }
    }

},

add_killer_square: function(x, y) {
    killerSquare = killerSquares.create(x, y, 'pipe');
    killerSquare.body.gravity.y = 1000;  
    killerSquare.body.velocity.x = -200;
    killerSquare.body.y.bounce = 0.1;

},


collectDeathStar: function() {
    
    // Removes the star from the screen
    deathstar.kill();

    //  Add and update the score
    superJumps += 1;
    superJumpsLabel.content = "power jump: " + superJumps;

},
// Make the bird jump 
jump: function() {  
    // Add a vertical velocity to the bird
    if(this.bird.body.touching.down) {
        this.bird.body.velocity.y = -350;
    } else if(superJumps) {
       this.super_jump();
    }
},

// Restart the game
restart_game: function() {  
	this.game.time.events.remove(this.timer);  
    score = 0;
    // Start the 'main' state, which restarts the game
    this.game.state.start('main');
},


super_jump: function() {
     superJumps -= 1;
     this.bird.body.velocity.y = -500;
     superJumpsLabel.content = "power jump: " + superJumps;
},

add_plane: function(x,y) {  

    this.brick = bricks.create(x, y, 'beach');
    this.brick.body.collideWorldBounds = true;
    this.brick.body.checkCollision.left = false;
    this.brick.body.checkCollision.right = false;
    this.brick.body.immovable = true;

},


add_deathstar: function(x,y) {
    deathStars = game.add.group();
    deathstar = deathStars.create(x, y, 'star');
},

add_one_pipe: function(x, y) {  
    // Get the first dead pipe of our group
    var pipe = this.pipes.getFirstDead();

    // Set the new position of the pipe
    //pipe.reset(x, y);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = 0; 

    // Kill the pipe when it's no longer visible 
    pipe.outOfBoundsKill = true;
},



add_row_of_pipes: function() {  
 

     score += 1;  
     scoreLabel.content = "time: " + score; 


		},
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 