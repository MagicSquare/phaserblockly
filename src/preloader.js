var preloader = function( game )
{}

preloader.prototype = 
{
	preload: function()
	{ 
		var loadingBar = this.add.sprite( 160, 240,"loading" );
		
		loadingBar.anchor.setTo( 0.5, 0.5 );
		
		this.load.setPreloadSprite( loadingBar );
		
		// Put all the global resources here
		
	},
  	create: function()
	{
		this.game.state.start( "Tree" );
	}
}

preloader.getStateName = function(){ return "Preloader"; };