
var leveleditortest01 = function( game )
{};
  
leveleditortest01.prototype = 
{
	preload: function()
	{	
	/*
		ms_EditorLevelResourcesAutomate.parseCode();
	
		while( ms_EditorLevelResourcesAutomate.nextStep() )
		{
			if( ms_OnBlocklyLevelEditorResources )
				while( ms_OnBlocklyLevelEditorResources.go( this ) )
				{}
		
			ms_OnBlocklyLevelEditorResources = null;
		}
		*/
		
	},
  	create: function()
	{
		ms_EditorLevelCreateAutomate.parseCode();
		
		while( ms_EditorLevelCreateAutomate.nextStep() )
		{
			if( ms_OnBlocklyLevelEditorCreate )
				while( ms_OnBlocklyLevelEditorCreate.go( this ) )
				{}
		
			ms_OnBlocklyLevelEditorCreate = null;
		}
		
		var aGoBackButton = this.game.add.button( this.game.width, this.game.height, "backtotree", this.getGoToState( tree.getStateName() ), this );
		aGoBackButton.anchor.setTo( 1.0, 1.0 );
	},
	update: function()
	{	
	/*
		ms_EditorLevelUpdateAutomate.parseCode();
		
		while( ms_EditorLevelUpdateAutomate.nextStep() )
		{
			if( ms_OnBlocklyLevelEditorUdpate )
				while( ms_OnBlocklyLevelEditorUdpate.go( this ) )
				{}
			
			ms_OnBlocklyLevelEditorUdpate = null;
		}
		*/
		if( ms_OnBlocklyUpdate )
		{
			if( !ms_OnBlocklyUpdate.go( this ) )
			{
				ms_OnBlocklyUpdate = null;

				ms_GameUpdateAutomate.nextStep();
			}
		}
	},			
	getGoToState: function( inStateName )
	{
		return function (){ this.game.state.start( inStateName ); };
	}
}

leveleditortest01.getStateName = function(){ return "level_editor_test_01"; };