import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import TreeState from './states/TreeState';
import PhaserDemo1State from './states/PhaserDemo1State';
import GlassMarblesState from './states/GlassMarblesState';

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.AUTO, 'phaserGame', null);
        this.ms_OnBlocklyUpdate = new BlockInstructionEmpty();

        this.state.add(BootState.getStateName(), BootState);
        this.state.add(PreloaderState.getStateName(), PreloaderState);
        this.state.add(TreeState.getStateName(), TreeState);
        this.state.add(PhaserDemo1State.getStateName(), PhaserDemo1State);
        this.state.add(GlassMarblesState.getStateName(), GlassMarblesState);

        this.state.start(BootState.getStateName());
    }
}

new Game();