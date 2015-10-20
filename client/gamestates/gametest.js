var GameTest = function (game) {
};

GameTest.prototype = {

  preload: function(){

    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    var player;
    var platforms;
    var stars;
    var counter = 0;

  },

  create: function(){
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // ground.scale.setTo(2x, 2x) basically
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');  // ledge 1
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');  // ledge 2
    ledge.body.immovable = true;

    // ======== STARS ==========
    stars = this.game.add.group();
    stars.enableBody = true;

    var star = stars.create(0, 0, 'star');
    star.body.gravity.y = 500; 
    star.body.collideWorldBounds = true;
    // game.physics.arcade.enable(star);
    this.game.physics.enable(star, Phaser.Physics.ARCADE);

    // The player and its settings
    player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    cursors = this.game.input.keyboard.createCursorKeys();
    
  },

  update: function(){
      // Collide the player with the platforms
      this.game.physics.arcade.collide(player, platforms);

      // Collide the stars with the platforms
      this.game.physics.arcade.collide(stars, platforms);

      // Collide the player with the stars
      this.game.physics.arcade.collide(stars, player, this.collisionHandler, null, this);


      // Player touches star
      // game.physics.arcade.overlap(stars, player, collisionHandler, null, this);



      //  Reset the players velocity (movement)
      player.body.velocity.x = 0;

      if (cursors.left.isDown)
      {
          //  Move to the left
          player.body.velocity.x = -150;

          player.animations.play('left');
      }
      else if (cursors.right.isDown)
      {
          //  Move to the right
          player.body.velocity.x = 150;

          player.animations.play('right');
      }
      else
      {
          //  Stand still
          player.animations.stop();

          player.frame = 4;
      }

      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown && player.body.touching.down)
      {
          player.body.velocity.y = -350;
      }
  },

  //  Called if the bullet hits one of the veg sprites
  collisionHandler: function(player, stars){
    console.log('I touched the star!!');
  }

};



