/**
 * Created by Jota on 28/08/2017.
 */

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

    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game");

    this.assets = new Assets();

    this.init = function(){

        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };


        this.game.time.advancedTiming = true;

        this.game.state.add(STATES.LOAD, load);
        this.game.state.add(STATES.MENU, menu);
        this.game.state.add(STATES.GAME, game);

        this.game.state.start(STATES.LOAD);

    };
}