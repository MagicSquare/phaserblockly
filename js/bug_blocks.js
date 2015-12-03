/// Before to run the instructions reinit this one.
///
var ms_CounterStep = 0;

/// To show step by step mod
///
function getEndBlockCode()
{
	var aCounter = ms_CounterStep;

	ms_CounterStep++;

	return 'highlightBlock( ' + aCounter + ' );' ;
}

/// Template of an empty instruction
///
function BlockInstructionEmpty()
{
	this.go = function()
	{
		return false;
	};
}

/// Template str basic instruction
///
/// @param inMembers str members arrays
///
/// @param inStrFuncGo string function definition: Has to return false to close
/// 				   the instruction
///
function getStrBlockInstruction( inMembers, inStrFuncGo )
{
	var aResult = "";
	
	aResult += "function()";
	aResult += "{"
	
	for (i = 0; i < inMembers.length; i++) 
	{
		aResult += "this." + inMembers[i] + ";"
	}
	
	aResult +=	  	"this.go = function()";
	aResult += 		"{";
	aResult += 			inStrFuncGo;
	aResult += 		"};";
	aResult += "}";

	return aResult;
}

/// Create a basic class instructions
///
/// @param inMembers array of members example : ["m_Count=10"]
///
/// @param inStrFuncGo go str function example : 
///	aGoFunc =  "if( 0 < this.m_Count )"
///	aGoFunc += "{"
///	aGoFunc +=		"ms_Phaser.m_Player.body.velocity.y = -350;"
///	aGoFunc +=      "this.m_Count--;"					
///	aGoFunc +=		"return true;" // It's not the instruction end. We have to continue.
///	aGoFunc += "}"
///	aGoFunc += "else"
///	aGoFunc += "{"
///	aGoFunc +=		"return false;" // Instruction end.
///	aGoFunc += "}"
///
function CreateBasicFunction( inMembers, inStrFuncGo )
{
	var aGoFunc = 'ms_OnBlocklyUpdate = new ' + getStrBlockInstruction( inMembers, inStrFuncGo ) + ';' ;
		
	var aResult = '';
	
	aResult += 'eval( "'+ aGoFunc + '" );' ;	
	aResult += getEndBlockCode(); //Step by Step

	//eval( aResult ); //Debug to see if the code works

	return aResult;
}

/// Move Left @see index.html toolbox
///
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

Blockly.JavaScript['bug_move_left'] = function(block)
{ 
  	var aTextCycle = block.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	var aGoFunc = ""
	
	aGoFunc += "ms_Phaser.m_Player.body.velocity.x = 0;" //  Reset the players velocity (movement)
		
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"		
	aGoFunc += 		"ms_Phaser.m_Player.body.velocity.x = -150;" //  Move to the right
	aGoFunc += 		"ms_Phaser.m_Player.animations.play('left');"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"		
	aGoFunc += 		"ms_Phaser.m_Player.animations.stop();" //  Stand still
	aGoFunc += 		"ms_Phaser.m_Player.frame = 4;"
	aGoFunc += 		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/// Move Right @see index.html toolbox
///
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

Blockly.JavaScript['bug_move_right'] = function(block)
{ 
  	var aTextCycle = block.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	var aGoFunc = ""
		
	aGoFunc += "ms_Phaser.m_Player.body.velocity.x = 0;" //  Reset the players velocity (movement)
			
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"		
	aGoFunc += 		"ms_Phaser.m_Player.body.velocity.x = 150;" //  Move to the right
	aGoFunc += 		"ms_Phaser.m_Player.animations.play('right');"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"		
	aGoFunc += 		"ms_Phaser.m_Player.animations.stop();" //  Stand still
	aGoFunc += 		"ms_Phaser.m_Player.frame = 4;"
	aGoFunc += 		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/// Jump @see index.html toolbox
///
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

Blockly.JavaScript['bug_jump'] = function(block)
{
	var aTextCycle = block.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = ""
	
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"
	aGoFunc +=		"ms_Phaser.m_Player.body.velocity.y = -350;"
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"					
	aGoFunc +=		"ms_Phaser.m_Player.animations.stop();" //  Stand still
	aGoFunc +=		"ms_Phaser.m_Player.frame = 4;"				
	aGoFunc +=		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/// Wait @see index.html toolbox
///
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

Blockly.JavaScript['bug_wait'] = function(block)
{
	var aTextCycle = block.getFieldValue('cycle');
  
	var aMembers = ["m_Count = " + aTextCycle]

	// Allow the player to jump if they are touching the ground.
	var aGoFunc = ""
	
	aGoFunc += "if( 0 < this.m_Count )"
	aGoFunc += "{"
	aGoFunc +=		"ms_Phaser.m_Player.animations.stop();" //  Stand still
	aGoFunc +=		"ms_Phaser.m_Player.frame = 4;"		
	aGoFunc +=      "this.m_Count--;"					
	aGoFunc +=		"return true;"
	aGoFunc += "}"
	aGoFunc += "else"
	aGoFunc += "{"							
	aGoFunc +=		"return false;"
	aGoFunc += "}"

	return CreateBasicFunction( aMembers, aGoFunc );
};

/// Move Loop @see index.html toolbox
///
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

Blockly.JavaScript['bug_controls_loop'] = function(block)
{
	var text_count = block.getFieldValue('count');
	var statements_name = Blockly.JavaScript.statementToCode(block, 'innerCode');
  
	var code = 'for( var i=0; i < ' + text_count + '; i++ ) {' + statements_name + '}';
	
	return code;
};

