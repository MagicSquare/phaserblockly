/** Step counter to naming the highlight tag 
*	@remarks Before to run the instructions reinit this one. 
*/
var ms_CounterStep = 0;

/** To show step by step mod */
function getEndBlockCode()
{
	var aCounter = ms_CounterStep;

	ms_CounterStep++;

	return 'highlightBlock( ' + aCounter + ' );' ;
}

/** Template of an empty instruction 
*	@class 
*	@constructor
*/
function BlockInstructionEmpty()
{
	/**	Each update the state class has to call the go function.
	*
	*	@param {object} [inState] - use that to access at the state variables.
	*
	* 	@method BlockInstructionEmpty#go
	*/
	this.go = function( inState )
	{
		return false;
	};
}

/** Template str basic instruction
*
*	@param {string[]} [inMembers] - str members arrays
*
*   @param {string} [inStrFuncGo] string function definition: Has to return false to close
* 				                  the instruction
*
*	@remarks got to the blockfactory @link https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
*			 to create your own block.
*/
function getStrBlockInstruction( inMembers, inStrFuncGo )
{
	var aResult = "";
	
	aResult += "function()";
	aResult += "{"
	
    for( i = 0; i < inMembers.length; i++ ) 
    {
        aResult += "this." + inMembers[i] + ";"
	}
	
	aResult +=	  	"this.go = function( inState )";
	aResult += 		"{";
	aResult += 			inStrFuncGo;
	aResult += 		"};";
	aResult += "}";
	
	//eval(aResult);

	return aResult;
}

/** Create a basic class instructions
*	
*	@param {string[]} [inMembers array] of members example : ["m_Count=10"]
*	
*	@param {string} [inStrFuncGo] go str function example : 
*
*		   aGoFunc =  "if( 0 < this.m_Count )"
*		   aGoFunc += "{"
*		   aGoFunc +=		"inState.m_Player.body.velocity.y = -350;"
*		   aGoFunc +=      "this.m_Count--;"					
*		   aGoFunc +=		"return true;" // It's not the instruction end. We have to continue.
*		   aGoFunc += "}"
*		   aGoFunc += "else"
*		   aGoFunc += "{"
*		   aGoFunc +=		"return false;" // Instruction end.
*		   aGoFunc += "}"
*/
function CreateBasicFunction( inMembers, inStrFuncGo )
{
	var aGoFunc = 'ms_OnBlocklyUpdate = new ' + getStrBlockInstruction( inMembers, inStrFuncGo ) + ';' ;
		
	var aResult = '';
	
	aResult += 'eval( "'+ aGoFunc + '" );' ;	
	aResult += getEndBlockCode(); //Step by Step

	//eval( aResult ); //Debug to see if the code works

	return aResult;
}

/** Move Left @see index.html toolbox */
Blockly.Blocks['bug_move_left'] =
{
	init: function()
	{
		this.appendDummyInput()
			.appendField("Left")
			.appendField(new Blockly.FieldTextInput("1"), "cycle")
			.appendField("cycle(s)");
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(0);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_move_left'] = function( inBlock )
{ 
  	var aTextCycle = inBlock.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	var aGoFunc = ""
	
	aGoFunc += "inState.m_Player.body.velocity.x = 0;" //  Reset the players velocity (movement)
		
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"		
	aGoFunc += 		"inState.m_Player.body.velocity.x = -150;" //  Move to the right
	aGoFunc += 		"inState.m_Player.animations.play('left');"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"		
	aGoFunc += 		"inState.m_Player.animations.stop();" //  Stand still
	aGoFunc += 		"inState.m_Player.frame = 4;"
	aGoFunc += 		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/** Move Right @see index.html toolbox */
Blockly.Blocks['bug_move_right'] =
{
	init: function()
	{
		this.appendDummyInput()
			.appendField("Right")
			.appendField( new Blockly.FieldTextInput("1"), "cycle")
			.appendField("cycle(s)");
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(0);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_move_right'] = function( inBlock )
{ 
  	var aTextCycle = inBlock.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	var aGoFunc = ""
		
	aGoFunc += "inState.m_Player.body.velocity.x = 0;" //  Reset the players velocity (movement)
			
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"		
	aGoFunc += 		"inState.m_Player.body.velocity.x = 150;" //  Move to the right
	aGoFunc += 		"inState.m_Player.animations.play('right');"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"		
	aGoFunc += 		"inState.m_Player.animations.stop();" //  Stand still
	aGoFunc += 		"inState.m_Player.frame = 4;"
	aGoFunc += 		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/** Jump @see index.html toolbox */
Blockly.Blocks['bug_jump'] =
{
	init: function()
	{
		this.appendDummyInput()
			.appendField( "Jump" )
			.appendField( new Blockly.FieldTextInput("1"), "cycle" )
			.appendField( "cycle(s)" );
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(0);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_jump'] = function( inBlock )
{
	var aTextCycle = inBlock.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = ""
	
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"
	aGoFunc +=		"inState.m_Player.body.velocity.y = -350;"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"					
	aGoFunc +=		"inState.m_Player.animations.stop();" //  Stand still
	aGoFunc +=		"inState.m_Player.frame = 4;"				
	aGoFunc +=		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/** Wait @see index.html toolbox */
Blockly.Blocks['bug_wait'] =
{
	init: function()
	{
		this.appendDummyInput()
			.appendField( "Wait" )
			.appendField( new Blockly.FieldTextInput("1"), "cycle" )
			.appendField( "cycle(s)" );
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(0);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_wait'] = function( inBlock )
{
	var aTextCycle = inBlock.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = ""
	
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"
	aGoFunc +=		"inState.m_Player.animations.stop();" //  Stand still
	aGoFunc +=		"inState.m_Player.frame = 4;"		
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"							
	aGoFunc +=		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/** Move Loop @see index.html toolbox */
Blockly.Blocks['bug_controls_loop'] =
{
	init: function() 
	{
			this.appendDummyInput()
				.appendField("Repeat")
				.appendField( new Blockly.FieldTextInput("2"), "count" )
				.appendField("times.");
			this.appendStatementInput("innerCode");
			this.setPreviousStatement(true);
			this.setNextStatement(true);
			this.setColour(135);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_controls_loop'] = function( inBlock )
{
	var text_count = inBlock.getFieldValue('count');
	var statements_name = Blockly.JavaScript.statementToCode( inBlock, 'innerCode');
  
	var code = 'for( var i=0; i < ' + text_count + '; i++ ) {' + statements_name + '}';
	
	return code;
};

/** Load image
*	Phase equivalent example :
*		this.game.load.image( 'sky', 'assets/sky.png' );
*/
Blockly.Blocks['bug_loadimage'] = 
{
	init: function()
	{
		this.appendDummyInput()
			.appendField("Id")
			.appendField(new Blockly.FieldTextInput("default"), "ID");
		this.appendDummyInput()
			.appendField("Path")
			.appendField(new Blockly.FieldTextInput("asset/default.png"), "PATH");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(20);
		this.setTooltip('');
		this.setHelpUrl('http://www.example.com/');
	}
};

Blockly.JavaScript['bug_loadimage'] = function( inBlock )
{
	var aTextId = inBlock.getFieldValue('ID');
	var aTextPath = inBlock.getFieldValue('PATH');
	
	var aMembers = ["m_Image = null"];

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = "";
	
	aGoFunc += "this.m_Image = inState.game.load.image( '" + aTextId + "', '" + aTextPath + "' );";						
	aGoFunc += "return false;";

	return CreateBasicFunction( aMembers, aGoFunc );
};

/** Add sprite :
*	Phase equivalent example :
*		this.game.add.sprite( 0, 0, 'sky' );
*/
Blockly.Blocks['bug_addsprite'] = 
{
	init: function() 
	{
		this.appendDummyInput()
			.appendField( "x" )
			.appendField( new Blockly.FieldTextInput( "0" ), "X" );
		this.appendDummyInput()
			.appendField( "y" )
			.appendField( new Blockly.FieldTextInput( "0" ), "Y" );
		this.appendDummyInput()
			.appendField( "Image id" )
			.appendField( new Blockly.FieldTextInput( "default" ), "ID" );
		this.setInputsInline( true );
		this.setPreviousStatement( true, null );
		this.setNextStatement( true, null );
		this.setColour( 230 );
		this.setTooltip( '' );
		this.setHelpUrl( 'http://www.example.com/' );
	}
};

Blockly.JavaScript['bug_addsprite'] = function( inBlock )
{
	var aTextx = inBlock.getFieldValue('X');
	var aTexty = inBlock.getFieldValue('Y');
	var aTextId = inBlock.getFieldValue('ID');
	
	var aMembers = ["m_Sprite = null"];

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = "";
	
	aGoFunc += "this.m_Sprite = inState.game.add.sprite( " + aTextx + ", " + aTexty + ", '" + aTextId + "' );";						
	aGoFunc += "return false;";
	
	return CreateBasicFunction( aMembers, aGoFunc );
};
