/**
 * Created by Jota on 28/08/2017.
 */

function Assets() {

    // Loading bar example
    // https://github.com/MattMcFarland/phaser-menu-system

    this.load = function(){

        var load = engine.game.load;

        load.image('tiles', 'assets/tiles.jpg');
        load.spritesheet('player', 'assets/dude.png', 32, 48);
        load.image('background', 'assets/background.png');

    };

}