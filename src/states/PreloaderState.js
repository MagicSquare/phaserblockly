import TreeState from './TreeState';

class PreloaderState extends Phaser.State {

    preload() {
        var loadingBar = this.add.sprite(160, 240, "loading");

        loadingBar.anchor.setTo(0.5, 0.5);

        this.load.setPreloadSprite(loadingBar);

        // Put all the global resources here
    }

    create() {
        this.game.state.start(TreeState.getStateName());
    }

    static getStateName() {
        return "Preloader";
    }
}

export default PreloaderState;