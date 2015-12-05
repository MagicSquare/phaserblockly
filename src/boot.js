var boot = function( game )
{
	console.log( "%cStarting bug Game", "color:white; background:red" );
};
  
boot.prototype = 
{
	preload: function()
	{
		this.game.load.image( "loading", "assets/logo.png" ); 
	},	
  	create: function()
	{
		/*
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.setScreenSize();
		*/
		this.game.state.start( preloader.getStateName() );
	},
}

boot.getStateName = function(){ return "Boot"; };