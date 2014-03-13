Player = function(game) {

    this.game = game;
    this.sprite = null;
    this.cursors = null;

};

Player.prototype = {

    preload: function () {
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },

    create: function () {
        this.sprite = game.add.sprite(32, game.world.height - 150, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 20;
        this.sprite.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {

        this.sprite.body.velocity.x = 0;

        if(this.cursors.left.isDown)
        {
            this.sprite.body.velocity.x = -250;

            this.sprite.animations.play('left');
        }
        else if(this.cursors.right.isDown)
        {
            this.sprite.body.velocity.x = 250;

            this.sprite.animations.play('right');
        }
        else
        {
            this.sprite.animations.stop();
            this.sprite.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.sprite.body.touching.down)
        {
            this.sprite.body.velocity.y = -650;
        }
    }

};