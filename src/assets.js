/**
 * Created by Jota on 28/08/2017.
 */

function Assets() {

    // Loading bar example
    // https://github.com/MattMcFarland/phaser-menu-system

    this.load = function(){

        var load = engine.game.load;

        load.spritesheet('player', 'assets/dude.png', 32, 48);

    };

}