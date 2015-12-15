
var glassmarbles2 = function( game )
{
	this.m_Player = null;
	this.m_Cursors = null;
	this.m_Balls = null;
	this.m_BallsSFX = null;
	this.m_MaxBallsLenght = 200;
	this.m_WaitToAddBall = 1333; //milliseconds
	this.m_BallsAnimIdleName = 'idle';
	this.m_BallsAnimDeathName = 'death';
	
	this.m_BluePath = null;		
	this.m_RedPath = null;
	this.m_GreenPath = null;	
	this.m_Rocks = null;	

	this.m_Score = 0;
	this.m_ScoreText = 'score: 0';
	
	this.m_PhysicDebug = false;
};
  
glassmarbles2.prototype = 
{
	preload: function()
	{		
		this.game.load.image( 'sky', 'assets/sky.png' );
		
		this.game.load.image( 'rocks', 'assets/glassmarbles_01.png' );
		this.game.load.image( 'path_green', 'assets/glassmarbles_01-green.png' );
		this.game.load.image( 'path_blue', 'assets/glassmarbles_01-blue.png' );
		this.game.load.image( 'path_red', 'assets/glassmarbles_01-red.png' );
		
		this.game.load.physics( "sprite_physics", "assets/glassmarbles_01.json" );

		this.game.load.image( 'backtotree', 'assets/back_to_tree_01.png' );
		this.game.load.spritesheet( 'dude', 'assets/dude.png', 32, 48 );
		this.game.load.spritesheet( 'balls-animates', 'assets/balls-animates.png', 17, 17 );
		
		this.game.load.audio( 'balloom-pop', 'assets/balloom-pop.mp3' );
	},
  	create: function()
	{
		// Start the P2 Physics Engine
		this.game.physics.startSystem( Phaser.Physics.P2JS );
		this.game.physics.p2.setImpactEvents( true );
		
		// Set the gravity
		this.game.physics.p2.gravity.y = 1000;
		
		//  A simple background for our game			
		this.game.add.sprite( 0, 0, 'sky' );		
			
		// Balls Paths
		this.m_BluePath = this.game.add.sprite( 0, 0, 'path_blue' );	
		this.m_RedPath = this.game.add.sprite( 0, 0, 'path_red' );	
		this.m_GreenPath = this.game.add.sprite( 0, 0, 'path_green' );
		
		this.m_Rocks = this.game.add.sprite( this.game.world.width * 0.5, this.game.world.height * 0.5, 'rocks' );	
	
		// The player and its settings		
		this.m_Player = this.game.add.sprite( 32, this.game.world.height - 50, 'dude' ); 	
		this.game.physics.p2.enable( [this.m_Player], this.m_PhysicDebug );	
		this.m_Player.body.fixedRotation = true;		
		
		aSpritesPhysics = [];
		//aSpritesPhysics.push( this.m_BluePath );
		//aSpritesPhysics.push( this.m_RedPath );
		//aSpritesPhysics.push( this.m_GreenPath );
		aSpritesPhysics.push( this.m_Rocks );
		
		this.game.physics.p2.enable( aSpritesPhysics, this.m_PhysicDebug );
		
		//this.m_BluePath.body.clearShapes();
		//this.m_BluePath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-blue');		

		//this.m_RedPath.body.clearShapes();
		//this.m_RedPath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-red');		
		
		//this.m_GreenPath.body.clearShapes();
		//this.m_GreenPath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-green');
		
		this.m_Rocks.body.clearShapes();
		this.m_Rocks.body.loadPolygon( 'sprite_physics', 'glassmarbles_01');

		for( i = 0; i < aSpritesPhysics.length; i++ )
		{
			aSpritesPhysics[i].body.static = true;
		}		

		//  Our two animations, walking left and right.
		this.m_Player.animations.add( 'left', [0, 1, 2, 3], 10, true );
		this.m_Player.animations.add( 'right', [5, 6, 7, 8], 10, true );
		
		this.m_Cursors = this.game.input.keyboard.createCursorKeys();

		// http://phaser.io/docs/2.4.4/Phaser.Group.html
		this.m_Balls = this.game.add.physicsGroup( Phaser.Physics.P2JS );
		
		// delay (ms), callbacks, context
		this.game.time.events.loop( this.m_WaitToAddBall, this.createBalls, this );
		
		//	Here we set-up our audio sprite
		this.m_BallsSFX = this.game.add.audio( 'balloom-pop' );
		this.m_BallsSFX.allowMultiple = true;
		
		this.m_ScoreText = this.game.add.text( 16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' } );
		
		var aGoBackButton = this.game.add.button( this.game.width, this.game.height, "backtotree", this.getGoToState( tree.getStateName() ), this );
		aGoBackButton.anchor.setTo( 1.0, 1.0 );
	},
	update: function()
	{				
		if( ms_OnBlocklyUpdate )
		{
			if( !ms_OnBlocklyUpdate.go( this ) )
			{
				ms_OnBlocklyUpdate = null;

				ms_GameUpdateAutomate.nextStep();
			}
		}		
	},	
	render: function()
	{
		//this.game.debug.text( "Group size: " + this.m_Balls.total, 32, 32 );
	},	
	getGoToState: function( inStateName )
	{
		return function (){ this.game.state.start( inStateName ); };
	},
	collectBall: function( inPlayer, inBall )
	{
		try
		{
			if( inBall.sprite.animations.currentAnim.name != this.m_BallsAnimDeathName )
			{
				inBall.sprite.animations.play( this.m_BallsAnimDeathName, null, false, true );
				// inBall.sprite.kill();
				this.m_BallsSFX.play();
			}
		}
		catch( e )
		{
			console.log( inBall.sprite );
		}

		// Add and update the score
		this.m_Score += 10;
		this.m_ScoreText.text = 'Score: ' + this.m_Score;
	},
	createBalls: function()
	{
		if( this.m_Balls.total < this.m_MaxBallsLenght )
		{
			this.m_WaitToAddBallCounter = 0;
			
			var aBall = this.m_Balls.create( this.game.width * 0.5 + this.game.rnd.integerInRange(-70,-10), 10, 'balls-animates' );
				
			aBall.body.setCircle( 9 );
			aBall.body.fixedRotation = true;

			// Here we add a new animation called 'idle'
			// We have specified the frame 0 but you can edit the image and add  because it's using every frame in the texture atlas
			// name, frames, frameRate, loop 
			aBall.animations.add( this.m_BallsAnimIdleName , [0], 10, true );
			aBall.animations.add( this.m_BallsAnimDeathName, [1,2,3,4,5], 10, false );
			
			//  And this starts the animation playing by using its key ("idle")
			aBall.animations.play( this.m_BallsAnimIdleName  );
			
			this.m_Player.body.createBodyCallback( aBall, this.collectBall, this );
		}			
	}
}

glassmarbles2.getStateName = function(){ return "glassmarbles2"; };