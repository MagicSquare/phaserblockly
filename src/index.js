/** Pointeur sur fonction */
var ms_OnBlocklyUpdate = new BlockInstructionEmpty();

/** @class Game
 */
function Game()
{
    this.m_Game = new Phaser.Game( 800, 600, Phaser.AUTO, '' );

    this.m_Game.state.add( boot.getStateName(), boot );
    this.m_Game.state.add( preloader.getStateName(), preloader );
    this.m_Game.state.add( tree.getStateName(), tree );
    this.m_Game.state.add( phaserdemo1.getStateName(), phaserdemo1 );
    this.m_Game.state.add( glassmarbles.getStateName(), glassmarbles );

    this.m_Game.state.start( boot.getStateName() );
}

var ms_Phaser = new Game();