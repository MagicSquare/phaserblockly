import PreloaderState from './PreloaderState';

class BootState extends Phaser.State {

    preload() {
        this.game.load.image("loading", "../assets/logo.png");
    }

    create() {
        /*
         this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         this.scale.pageAlignHorizontally = true;
         this.scale.setScreenSize();
         */
        this.game.state.start(PreloaderState.getStateName());
    }

    static getStateName() {
        return "Boot";
    }
}

export default BootState;