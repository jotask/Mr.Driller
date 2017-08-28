/**
 * Created by Jota on 28/08/2017.
 */

const engine = new Engine();

window.onload = function(){
    engine.init();
};

function Engine(){

    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game");
    this.assets = new Assets();

    this.init = function(){

        this.game.state.add(STATES.LOAD, load);
        this.game.state.add(STATES.MENU, menu);
        this.game.state.add(STATES.GAME, game);

        this.game.state.start(STATES.LOAD);

    };
}