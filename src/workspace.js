var code;

Blockly.JavaScript.addReservedWords( 'code' );
  
var workspace = Blockly.inject( 'blocklyDiv', { media : 'media/', toolbox : document.getElementById( 'toolbox' ) } );

function updateCode() 
{
	code = Blockly.JavaScript.workspaceToCode( workspace );
	document.getElementById( 'consoleTextarea' ).value = code;
}

var ms_Interpreter = null;

function nextStep() 
{
	try 
	{		
		if( ms_Interpreter ) 
		{	
			while( !ms_Interpreter.paused_ && ms_Interpreter.step() && !ms_OnBlocklyUpdate ) 
			{}
		}		
	}
	catch( e ) 
	{
		alert( e );
	}
}

function initApi(interpreter, scope) 
{
	// Add an API function for the eval() block.
	var wrapper = function( text ) 
	{
		text = text ? text.toString() : '';
		return interpreter.createPrimitive( eval( text ) );
	};	
	interpreter.setProperty( scope, 'eval', interpreter.createNativeFunction( wrapper ) );
	
	// Add an API function for the alert() block.
	wrapper = function( text ) 
	{
		text = text ? text.toString() : '';
		return interpreter.createPrimitive( alert( text ) );
	};
	interpreter.setProperty( scope, 'alert', interpreter.createNativeFunction( wrapper ) );

	  
	// Add an API function for the prompt() block.
	wrapper = function( text ) 
	{
		text = text ? text.toString() : '' ;
		return interpreter.createPrimitive( prompt( text ) );
	};	
	interpreter.setProperty( scope, 'prompt', interpreter.createNativeFunction( wrapper ) );
	
	// Add an API function for highlighting blocks.
	wrapper = function( id ) 
	{
		id = id ? id.toString() : '' ;
		return interpreter.createPrimitive( workspace.highlightBlock( id ) ) ;
	};
	interpreter.setProperty( scope, 'highlightBlock', interpreter.createNativeFunction( wrapper ) ) ;

}

var highlightPause = false;

function highlightBlock( id )
{
	workspace.highlightBlock( id );
	highlightPause = true;
}

function parseCode() 
{
	Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
	Blockly.JavaScript.addReservedWords('highlightBlock');
	
	ms_CounterStep = 0;
	ms_OnBlocklyUpdate = null;
	code = Blockly.JavaScript.workspaceToCode( workspace );
	
	ms_Interpreter = new Interpreter( code, initApi );
		
	document.getElementById('stepButton').disabled = '';
	
	highlightPause = false;
	
	workspace.traceOn(true);
	workspace.highlightBlock(null);
}

function stepClick() 
{
	if( ms_Interpreter && !ms_OnBlocklyUpdate )
	{
		try 
		{
			nextStep();
			
			if( highlightPause ) 
			{
				// A block has been highlighted.  Pause execution here.
				highlightPause = false;
			}
			else 
			{
				// Keep executing until a highlight statement is reached.
				stepClick();
			}
		} 
		finally
		{
			// Program complete, no more code to execute.
			document.getElementById('stepButton').disabled = '';
		}
	}
}

workspace.addChangeListener( updateCode );

$( "#buildandrunButton" ).click( function() 
{
	parseCode();
		
	nextStep();
});

$( "#resetButton" ).click( function() 
{	
	if( ms_Phaser )
	{
		ms_CounterStep = 0;
		ms_OnBlocklyUpdate = null;
		ms_Phaser.m_Game.state.start( ms_Phaser.m_Game.state.current );
	}
	
});

$( "#buildButton" ).click( function() 
{
	parseCode();
});

$( "#stepButton" ).click( function() 
{
	stepClick();
});
