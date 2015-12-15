/** @link http://hugoware.net/blog/passing-context-with-javascript */
Function.prototype.context = function(context) 
{
    var action = this;
    return function() { action.apply( context, arguments ); };
};


/** A automate in this context execute a step and the game has to ask for next
*	instruction.
*	@class 
*	@constructor
*
*	@param {object} [inPointerAcces]  An object to set and get an Instruction 
*									  pointer.
*   	@see bug_block.js
*
*		Example :
*			~~~{.js}*			
*			{
*				get: function(){ return ms_OnBlocklyUpdate; }
*				set: function(inInstruction){ ms_OnBlocklyUpdate = inInstruction; }
*			}
*			~~~
*
*	@param {string} [inBlocklyBoardId]  The blockly target, the whiteboard to
*		   place the blocks.
*
*		Example	:
*			~~~{.html}
*			<div class="tab-pane active" id="blocklyGame">
*				<div id="blocklyGameMenu" style="height: 400px; width:100%; "> 
*					<div style="float:right">
*						<button id="buildandrunButton">Build and run</button>
*						<button id="buildButton">Build</button>
*						<button id="stepButton" disabled="disabled">Step</button>
*						<button id="resetButton">Reset stage</button>
*					</div>
*				</div>
*			</div>
*			~~~
*			
*			The inBlocklyElementId is ""blocklyGameMenu"
*			
*	@param {string} [inBlocklyToolBoxId] The xml tool box id.
*		
*		Example:
*			~~~{.xml}		
*			<xml id="gametoolbox" style="display: none">
*				<block type="bug_move_left"></block>
*				<block type="bug_move_right"></block>
*				<block type="bug_jump"></block>
*				<block type="bug_wait"></block>
*				<block type="bug_controls_loop"></block>
*			</xml>
*			~~~
*			
*			The inBlocklyToolBoxId is "gametoolbox"
*
*	@param {string} [inBlocklyConsoleId] The console area element id. If it's 
*		   empty the area don't be use.
*		
*		Example:
*			~~~{.html}
*				<div class="tab-pane" style="height: 400px; width:100%;" id="blocklyGameCode">
*					<textarea id="consoleTextarea" rows="5" cols="50"></textarea>
*				</div>
*			~~~
*		
*			The inBlocklyConsoleId is "consoleTextarea"
*
*	@param {string} [inStepButtonId] The step button id to run the program step
*			                         by step. Can be empty.
*
*/
function Automate( inPointerAcces, inBlocklyBoardId, inBlocklyToolBoxId, inBlocklyConsoleId, inStepButtonId )
{
	this.m_PointerAcces = inPointerAcces;	
	this.m_BlocklyConsoleId = inBlocklyConsoleId;
	this.m_StepButtonId = inStepButtonId;
	
	this.m_WorkSpace = Blockly.inject( inBlocklyBoardId, { media : 'lib/blockly/media/', toolbox : document.getElementById( inBlocklyToolBoxId ) } );

	this.m_Interpreter = null;
		
	/** For the state mod
	*	@todo Pierre : fix the step mod. It's continuous. 
	*/
	this.m_HighlightPause = false;
	
	this.getAutomateInstance = function()
	{
		return eval( this.m_StrAutomateInstance );
	}
	
	this.updateCode = function()
	{	
		if( this.m_BlocklyConsoleId )
		{
			aCode = Blockly.JavaScript.workspaceToCode( this.m_WorkSpace );
			document.getElementById( this.m_BlocklyConsoleId ).value = aCode;
		}
	};
	
	this.nextStep = function() 
	{
		//try 
		{		
			if( this.m_Interpreter ) 
			{	
				while( !this.m_Interpreter.paused_ && this.m_Interpreter.step() && !this.m_PointerAcces.get() ) 
				{}
			}		
		}
		//catch( aError ) 
		//{
		//	alert( aError );
		//}
	};

	this.highlightBlock = function( id )
	{
		this.m_WorkSpace.highlightBlock( id );
		this.m_HighlightPause = true;
	};
    
	/**	@param {object} []inWorkspace] To avoid this bug :
									   Context problem m_WorkSpace is not 
									   define. 
		@link http://hugoware.net/blog/passing-context-with-javascript
		@link http://ejohn.org/apps/learn/#25
	*/
    this.initApi = function( inWorkspace ) 
    {
		return function( inInterpreter, inScope )
		{
			// Add an API function for the eval() block.
			var aWrapper = function( text ) 
			{
				text = text ? text.toString() : '';
				return inInterpreter.createPrimitive( eval( text ) );
			};	
			inInterpreter.setProperty( inScope, 'eval', inInterpreter.createNativeFunction( aWrapper ) );
			
			// Add an API function for the alert() block.
			aWrapper = function( text ) 
			{
				text = text ? text.toString() : '';
				return inInterpreter.createPrimitive( alert( text ) );
			};
			inInterpreter.setProperty( inScope, 'alert', inInterpreter.createNativeFunction( aWrapper ) );
			  
			// Add an API function for the prompt() block.
			aWrapper = function( text ) 
			{
				text = text ? text.toString() : '' ;
				return inInterpreter.createPrimitive( prompt( text ) );
			};	
			inInterpreter.setProperty( inScope, 'prompt', inInterpreter.createNativeFunction( aWrapper ) );
			
			// Add an API function for highlighting blocks.
			aWrapper = function( id ) 
			{
				id = id ? id.toString() : '' ;

				return inInterpreter.createPrimitive( inWorkspace.highlightBlock( id ) ) ;
			};
			inInterpreter.setProperty( inScope, 'highlightBlock', inInterpreter.createNativeFunction( aWrapper ) ) ;
		}        
    };

	this.parseCode = function() 
	{
		Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
		Blockly.JavaScript.addReservedWords('highlightBlock');
		
		this.ms_CounterStep = 0;
		this.m_PointerAcces.set( null );
		
		aCode = Blockly.JavaScript.workspaceToCode( this.m_WorkSpace );
		
		this.m_Interpreter = new Interpreter( aCode, this.initApi( this.m_WorkSpace ) );
		
		if( this.m_StepButtonId )
			document.getElementById( this.m_StepButtonId ).disabled = '';
		
		this.m_HighlightPause = false;
		
		this.m_WorkSpace.traceOn( true );
		this.m_WorkSpace.highlightBlock( null );
	};

	this.stepClick = function() 
	{
		if( this.m_Interpreter && !m_PointerAcces.get() )
		{
			//try 
			//{
				this.nextStep();
				
				if( this.m_HighlightPause ) 
				{
					// A block has been highlighted.  Pause execution here.
					this.m_HighlightPause = false;
				}
				else 
				{
					// Keep executing until a highlight statement is reached.
					this.stepClick();
				}
			//} 
			//finally
			//{
			//	if( this.m_StepButtonId )
			//	{
			//		// Program complete, no more code to execute.
			//		document.getElementById( this.m_StepButtonId ).disabled = '';
			//	}
			//}
		}
	};
}
