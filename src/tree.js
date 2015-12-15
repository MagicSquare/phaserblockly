var tree = function( game )
{}

tree.prototype = 
{
	preload: function()
	{ 
		this.game.load.image( "tree", "assets/tree.png");
		this.game.load.image( "spot", "assets/tree_level_spot_01.png");		
	},
  	create: function()
	{
		this.game.add.sprite( 0, 0, 'tree' );		
		
		this.addState( this.game.width * 0.5, this.game.height, phaserdemo1.getStateName(), 'Demo 1' );		
		this.addState( this.game.width * 0.5, this.game.height - 60, glassmarbles.getStateName(), 'Glass Marbles' );		
		this.addState( this.game.width * 0.5, this.game.height - 120, glassmarbles2.getStateName(), 'Glass Marbles2' );		
		this.addState( this.game.width * 0.5, this.game.height - 180, leveleditortest01.getStateName(), 'Level Editor Test 01' );		
	},	
	addState: function( x, y, inStateName, inTitle )
	{
		var aPlayButton = this.game.add.button( x, y, "spot", this.getGoToState( inStateName ), this );
		aPlayButton.anchor.setTo( 0.5, 1.0 );
		
		var aText = this.game.add.text( x, y - aPlayButton.height * 0.5, inTitle, { fontSize: '10px', fill: '#000' } );
		aText.anchor.setTo( 0.5, 0.5 );
	},
	getGoToState: function( inStateName )
	{
		return function (){ this.game.state.start( inStateName ); };
	}
}

tree.getStateName = function(){ return "Tree"; };