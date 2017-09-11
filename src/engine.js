/**
 * Created by Jose Vives on 28/08/2017.
 */

/*
*
* TODO:
*
*  ** resizable:
*               ** https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
*               ** http://www.netexl.com/blog/making-of-a-responsive-game-in-phaser-part-1/
*
* */

const engine = new Engine();

window.onload = function(){
    engine.init();
};
window.onkeydown = function (event) {
    if (event.keyCode === 32) {
        event.preventDefault();
    }
};

function Engine(){

    // var conf = {
    //     width: WIDTH,
    //     height: HEIGHT,
    //     renderer: Phaser.AUTO,
    //     parent: "game",
    //     transparent: false,
    //     antialias: false,
    //     state: STATES.LOAD,
    //     scaleMode: Phaser.ScaleManager.EXACT_FIT
    // };

    // TODO implement https://phaser.io/examples/v2/misc/game-config
    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game");

    this.game.smoothed = false;

    this.assets = new Assets();

    this.init = function(){

        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);


        this.game.time.advancedTiming = true;

        this.game.state.add(STATES.LOAD, load);
        this.game.state.add(STATES.MENU, menu);
        this.game.state.add(STATES.GAME, game);

        this.game.state.start(STATES.LOAD);

    };
}