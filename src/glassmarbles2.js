
var glassmarbles2 = function( game )
{
	this.m_Player = null;
	this.m_Cursors = null;
	this.m_Balls = null;
	this.m_BallsSFX = null;
	this.m_MaxBallsLenght = 0;
	this.m_WaitToAddBall = 0;
	this.m_LoopAddBalls = null ;
	this.m_BallsAnimIdleName = 'idle';
	this.m_BallsAnimDeathName = 'death';
	
	this.m_BluePath = null;		
	this.m_RedPath = null;
	this.m_GreenPath = null;	
	this.m_Rocks = null;
	this.m_Ground = null;

	this.m_Score = 0;
	this.m_ScoreText = null;
	this.m_OverlapText = null;
	
	// Game Over
	this.m_GameOverText = null;
	this.m_ButtonRetry = null;
	this.m_ButtonQuit = null;	
	
	this.m_PhysicDebug = false;
	this.m_BoundsDebug = false;
	this.m_Gravity = 600.0;
	
	// Player Positions
	this.m_RedPos = 120;
	this.m_GreenPos = 350;
	this.m_BluePos = 700;
	this.m_Origin = 400;
	this.m_PlayerVelocityX = 500;
	
	this.m_RedOverLap = false; /**< If true a ball it's on the red path */
	this.m_GreenOverLap = false; /**< If true a ball it's on the green path */
	this.m_BlueOverLap = false; /**< If true a ball it's on the blue path */
};
  
glassmarbles2.prototype = 
{
	/** Use this function to init the values. The Reset stage doesn't recreate
	*	the stage object.
	*/
	initValues: function()
	{
		this.m_MaxBallsLenght = 1;
		this.m_WaitToAddBall = 1333; //milliseconds
		
		this.m_RedOverLap = false;
		this.m_GreenOverLap = false;
		this.m_BlueOverLap = false;
		
		ms_Phaser.m_CurrentStage = this;
	},
	preload: function()
	{		
		this.game.load.image( 'sky', 'assets/07_glassmarbles_01_fond.png' );
		this.game.load.image( 'firstplan', 'assets/01_glassmarbles_01_firstplan.png' );
		
		this.game.load.image( 'rocks', 'assets/glassmarbles_01.png' );
		
		this.game.load.physics( "sprite_physics", "assets/glassmarbles_01.json" );

		this.game.load.image( 'backtotree', 'assets/back_to_tree_01.png' );
		this.game.load.spritesheet( 'avatar', 'assets/02_glassmarbles_01_avatar.png', 76, 42 );
		this.game.load.spritesheet( 'balls-animates', 'assets/glassmarbles_01final_animation_disparition.png', 64, 64 );
		
		this.game.load.audio( 'balloom-pop', 'assets/balloom-pop.mp3' );
		
		this.game.load.image( 'empty_32x32', 'assets/empty_32x32.png' );
	},
  	create: function()
	{
		this.initValues();
		
		// Start the P2 Physics Engine
		this.game.physics.startSystem( Phaser.Physics.P2JS );
		this.game.physics.p2.setImpactEvents( true );
		
		// Set the gravity
		this.game.physics.p2.gravity.y = this.m_Gravity;
		
		// A simple background for our game			
		this.game.add.sprite( 0, 0, 'sky' );			
			
		// Balls Paths
		this.game.add.sprite( 0, 0, 'path_blue' );	
		this.game.add.sprite( 0, 0, 'path_red' );	
		this.game.add.sprite( 0, 0, 'path_green' );
		
		this.m_Rocks = this.game.add.sprite( this.game.world.width * 0.5, this.game.world.height * 0.5, 'rocks' );

		//this.game.physics.p2.setBoundsToWorld( false, false, false, false );
		
		// Don't forget : P2 anchor is always place on the shape center.

		this.m_Ground = this.game.add.sprite( this.game.world.width * 0.5, 639, 'empty_32x32' );
		this.m_Ground.width = 800;
		this.m_Ground.height = 100;	
	
		// The player and its settings		
		this.m_Player = this.game.add.sprite( this.m_Origin, this.game.world.height - 50, 'avatar' ); 	
		this.game.physics.p2.enable( [this.m_Player], this.m_PhysicDebug );	
		this.m_Player.body.fixedRotation = true;	
		
		aSpritesPhysics = [];
		aSpritesPhysics.push( this.m_Rocks );
		aSpritesPhysics.push( this.m_Ground );
		
		this.game.physics.p2.enable( aSpritesPhysics, this.m_PhysicDebug );
		
		this.m_Rocks.body.clearShapes();
		this.m_Rocks.body.loadPolygon( 'sprite_physics', 'glassmarbles_01');
		
		for( i = 0; i < aSpritesPhysics.length; i++ )
		{
			aSpritesPhysics[i].body.static = true;
		}	
			
		this.createPaths();

		// Our two animations, walking left and right.
		this.m_Player.animations.add( 'left', [0], 10, true );
		this.m_Player.animations.add( 'right', [1], 10, true );
		this.m_Player.animations.add( 'idle', [1], 10, true );
		
		this.m_Cursors = this.game.input.keyboard.createCursorKeys();

		// http://phaser.io/docs/2.4.4/Phaser.Group.html
		this.m_Balls = this.game.add.physicsGroup( Phaser.Physics.P2JS );
				
		// delay (ms), callbacks, context
		this.m_LoopAddBalls = this.game.time.events.loop( this.m_WaitToAddBall, this.createBalls, this );
		this.game.time.events.loop( 250, this.checkOverlaps, this );
		
		//	Here we set-up our audio sprite
		this.m_BallsSFX = this.game.add.audio( 'balloom-pop' );
		this.m_BallsSFX.allowMultiple = true;
		
		this.m_ScoreText = this.game.add.text( 16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' } );
		this.m_OverlapText = this.game.add.text( 16, 48, 'Overlap: none', { fontSize: '32px', fill: '#fff' } );
		this.m_GameOverText = this.game.add.text( this.game.width / 2, this.game.height / 2, 'Game Over.', { fontSize: '32px', fill: '#fff' } );
		this.m_GameOverText.anchor.setTo( 0.5, 0.5 );
		
		this.m_GameOverText.visible = false;
		
		var aGoBackButton = this.game.add.button( this.game.width, this.game.height, "backtotree", this.getGoToState( tree.getStateName() ), this );
		aGoBackButton.anchor.setTo( 1.0, 1.0 );
		
		this.game.add.sprite( 0, 0, 'firstplan' );
	},
	update: function()
	{
		if( this.isNotGameOver() )
		{
			if( ms_OnBlocklyUpdate )
			{
				if( !ms_OnBlocklyUpdate.go( this ) )
				{
					ms_OnBlocklyUpdate = null;

					ms_GameUpdateAutomate.nextStep();
				}
			}	
		}
	},	
	render: function()
	{
		//this.game.debug.text( "Group size: " + this.m_Balls.total, 32, 32 );
		
		if( this.m_BoundsDebug )
		{
			var aDebugGroups = function( inPaths, inGame )
			{
				if( inPaths )
				{
					inPaths.forEach( inGame.debug.spriteBounds, inGame.debug );
				}
			};
			
			aDebugGroups( this.m_BluePath, this.game );
			aDebugGroups( this.m_GreenPath, this.game );
			aDebugGroups( this.m_RedPath, this.game );
			aDebugGroups( this.m_Balls, this.game );
		}
	},	
	getGoToState: function( inStateName )
	{
		return function (){ this.game.state.start( inStateName ); };
	},
	isNotGameOver: function()
	{
		return !this.m_GameOverText.visible;
	},
	createPaths: function()
	{
		// http://phaser.io/examples/v2/groups/call-all-input
		
		// Here we create our coins group
		this.m_BluePath = this.game.add.group();     
		this.m_GreenPath = this.game.add.group();     
		this.m_RedPath = this.game.add.group();     
 
		// Now place the red square path		
		var aRedSquare = this.m_RedPath.create( 60, 248, 'empty_32x32' );
		
		// Scale it to fit the width of the game (the original sprite is 400x32 in size)
		aRedSquare.width = 131;
		aRedSquare.height = 350;

		aRedSquare = this.m_RedPath.create( 276, 77, 'empty_32x32' );
		aRedSquare.width = 132;
		aRedSquare.height = 291;		
		aRedSquare.angle = 62;

		var aGreenSquare = this.m_GreenPath.create( 320, 355, 'empty_32x32' );	
		aGreenSquare.width = 77;
		aGreenSquare.height = 242;	

		aGreenSquare = this.m_GreenPath.create( 213, 287, 'empty_32x32' );	
		aGreenSquare.width = 278;
		aGreenSquare.height = 242;			
		
		var aBlueSquare = this.m_BluePath.create( 671, 355, 'empty_32x32' );	
		aBlueSquare.width = 77;
		aBlueSquare.height = 242;	

		aBlueSquare = this.m_BluePath.create( 494, 154, 'empty_32x32' );	
		aBlueSquare.width = 276;
		aBlueSquare.height = 377;
		
		aBlueSquare = this.m_BluePath.create( 394, 66, 'empty_32x32' );	
		aBlueSquare.width = 252;
		aBlueSquare.height = 189;		
	},
	checkOverlaps: function()
	{
		if( this.isNotGameOver() )
			this.m_Balls.forEach( this.checkOverlap, this );
	},
	checkOverlap: function( inBall )
	{	
		var aPrefix = 'Overlap: ';
		this.m_OverlapText.text =  aPrefix + 'none';	
		
		this.m_BlueOverLap = this.checkOverlapForEachPath( aPrefix + 'blue', this.m_BluePath, inBall, this.m_OverlapText );
		this.m_GreenOverLap = this.checkOverlapForEachPath( aPrefix + 'green', this.m_GreenPath, inBall, this.m_OverlapText );
		this.m_RedOverLap = this.checkOverlapForEachPath( aPrefix + 'red', this.m_RedPath, inBall, this.m_OverlapText );	

		//console.log( 'blue : ' + this.m_BlueOverLap + ' green :' + this.m_GreenOverLap + ' red :' + this.m_RedOverLap );
	},
	checkOverlapForEachPath: function( inText, inGroup, inBall, inOverLapText )
	{
		// http://www.html5gamedevs.com/topic/4760-best-way-to-recreate-old-physicsoverlap-using-p2/
		// http://www.html5gamedevs.com/topic/4839-p2-physics-overlap/	
		
		var aBoundsBall = inBall.getBounds();
		
		var aResult = false;
		
		inGroup.forEach( function( inPath )
		{
			aBounds = inPath.getBounds();
			
			if( Phaser.Rectangle.intersects( aBoundsBall, aBounds ) )
			{
				inOverLapText.text =  inText;	
				aResult = true;
			}	
		});

		return aResult;
	},
	collectBall: function( inPlayer, inBall )
	{
		try
		{
			if( inBall.sprite.animations.currentAnim.name != this.m_BallsAnimDeathName )
			{
				inBall.sprite.animations.play( this.m_BallsAnimDeathName, null, false, true );

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
	crashBall: function( inGround, inBall )
	{	
		if( inBall.sprite.animations.currentAnim.name != this.m_BallsAnimDeathName )
		{
			this.m_GameOverText.visible = true;
			
			this.m_MaxBallsLenght = 200;
			this.m_LoopAddBalls.delay = 20;

			// The paused state of the Game. A paused game doesn't update any of its
			// subsystems.
			// When a game is paused the onPause event is dispatched. When it is 
			// resumed the onResume event is dispatched.
			// this.game.pause = true;
		}
	},
	createBalls: function()
	{
		if( this.m_Balls.total < this.m_MaxBallsLenght )
		{
			this.m_WaitToAddBallCounter = 0;
			
			var aBall = this.m_Balls.create( this.game.rnd.integerInRange( 335, 430 ), 10, 'balls-animates' );
			
			aBall.anchor.setTo( 0.5, 6/7 );
			aBall.body.setCircle( 9 );
			aBall.body.fixedRotation = true;

			// Here we add a new animation called 'idle'
			// We have specified the frame 0 but you can edit the image and add  because it's using every frame in the texture atlas
			// name, frames, frameRate, loop 
			aBall.animations.add( this.m_BallsAnimIdleName , [0], 10, true );
			// aBall.animations.add( this.m_BallsAnimDeathName, [1,2,3,4,5], 10, false );
			aBall.animations.add( this.m_BallsAnimDeathName, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 10, false );
			
			// And this starts the animation playing by using its key ("idle")
			aBall.animations.play( this.m_BallsAnimIdleName );
			
			this.m_Player.body.createBodyCallback( aBall, this.collectBall, this );
			
			if( this.isNotGameOver() )
			{
				this.m_Ground.body.createBodyCallback( aBall, this.crashBall, this );
			}
		}			
	},
	isCloseToPalyer: function( inPositionX )
	{
		var aEpsilon = 10;
		
		return Math.abs( this.m_Player.body.x - inPositionX ) < aEpsilon; 
	}
}

glassmarbles2.getStateName = function(){ return "glassmarbles2"; };