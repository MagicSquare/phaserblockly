
var glassmarbles = function( game )
{
	this.m_Platforms = null;
	this.m_Player = null;
	this.m_Cursors = null;
	this.m_Balls = null;

	this.m_Score = 0;
	this.m_ScoreText = 'score: 0';
};
  
glassmarbles.prototype = 
{
	preload: function()
	{		
		this.game.load.image( 'sky', 'assets/sky.png' );
		this.game.load.image( 'ground', 'assets/platform.png' );
		this.game.load.image( 'backtotree', 'assets/back_to_tree_01.png' );
		this.game.load.spritesheet( 'dude', 'assets/dude.png', 32, 48 );
		this.game.load.spritesheet( 'balls', 'assets/balls.png', 17, 17 );
	},
  	create: function()
	{
		//  We're going to be using physics, so enable the Arcade Physics system
		this.game.physics.startSystem( Phaser.Physics.ARCADE );

		//  A simple background for our game
		this.game.add.sprite( 0, 0, 'sky' );

		//  The platforms group contains the ground and the 2 ledges we can jump on
		this.m_Platforms = this.game.add.group();

		//  We will enable physics for any object that is created in this group
		this.m_Platforms.enableBody = true;

		// Here we create the ground.
		var ground = this.m_Platforms.create( 0, this.game.world.height - 64, 'ground' );

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo( 2, 2 );

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = this.m_Platforms.create( 400, 400, 'ground' );

		ledge.body.immovable = true;

		ledge = this.m_Platforms.create( -150, 250, 'ground' );

		ledge.body.immovable = true;

		// The player and its settings
		this.m_Player = this.game.add.sprite( 32, this.game.world.height - 150, 'dude' );

		//  We need to enable physics on the player
		this.game.physics.arcade.enable( this.m_Player );

		//  Player physics properties. Give the little guy a slight bounce.
		this.m_Player.body.bounce.y = 0.2;
		this.m_Player.body.gravity.y = 300;
		this.m_Player.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		this.m_Player.animations.add( 'left', [0, 1, 2, 3], 10, true );
		this.m_Player.animations.add( 'right', [5, 6, 7, 8], 10, true );

		this.m_Cursors = this.game.input.keyboard.createCursorKeys();

		this.m_Balls = this.game.add.group();

		this.m_Balls.enableBody = true;

		//  Here we'll create 12 of them evenly spaced apart
		for( var i = 0; i < 12; i++ )
		{
			//  Create a ball inside of the 'stars' group
			var aBall = this.m_Balls.create( i * 70, 0, 'balls' );

			//  Let gravity do its thing
			aBall.body.gravity.y = 6;
			
			aBall.frame = this.game.rnd.integerInRange(0,6);

			//  This just gives each ball a slightly random bounce value
			aBall.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		this.m_ScoreText = this.game.add.text( 16, 16, 'score: 0', { fontSize: '32px', fill: '#000' } );
		
		var aGoBackButton = this.game.add.button( this.game.width, this.game.height, "backtotree", this.getGoToState( tree.getStateName() ), this );
		aGoBackButton.anchor.setTo( 1.0, 1.0 );
	},
	update: function()
	{
		//  Collide the player and the stars with the platforms
		this.game.physics.arcade.collide( this.m_Player, this.m_Platforms );
		this.game.physics.arcade.collide( this.m_Balls, this.m_Platforms );
		this.game.physics.arcade.overlap( this.m_Player, this.m_Balls, this.collectBall, null, this );

		if( ms_OnBlocklyUpdate )
		{
			if( !ms_OnBlocklyUpdate.go( this ) )
			{
				ms_OnBlocklyUpdate = null;

				nextStep();
			}
		}
	},			
	getGoToState: function( inStateName )
	{
		return function (){ this.game.state.start( inStateName ); };
	},
	collectBall: function( inPlayer, inBall )
	{
		// Removes the ball from the screen
		inBall.kill();

		//  Add and update the score
		this.m_Score += 10;
		this.m_ScoreText.text = 'Score: ' + this.m_Score;
	}
}

glassmarbles.getStateName = function(){ return "glassmarbles"; };