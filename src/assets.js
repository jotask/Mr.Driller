/**
 * Created by Jose Vives on 28/08/2017.
 */

function Assets() {

    // Loading bar example
    // https://github.com/MattMcFarland/phaser-menu-system

    // idea for loading system: https://phaser.io/examples/v2/groups/for-each

    this.load = function(){

        var load = engine.game.load;

        load.image('fire1', 'assets/particles/fire1.png');
        load.image('fire2', 'assets/particles/fire2.png');
        load.image('fire3', 'assets/particles/fire3.png');
        load.image('smoke', 'assets/particles/smoke-puff.png');

        load.image('tiles', 'assets/tiles.jpg');
        load.spritesheet('blocks', 'assets/tiles.jpg', 32, 32);
        load.spritesheet('player', 'assets/dude.png', 32, 48);
        load.image('background', 'assets/background.png');
        load.image('selection', 'assets/selection.png');
        load.spritesheet('breaking', 'assets/break.png', 32, 32);
        load.spritesheet('button', 'assets/button_sprite_sheet.png', 70, 71);
        load.spritesheet('investigating', 'assets/machine_invest.png', 32, 32);
        load.spritesheet('upgrades', 'assets/upgrades_machines.png', 64, 64);
        load.spritesheet('shop', 'assets/shop.png', 90, 65);

        load.spritesheet('factcards', 'assets/factcards.jpg', 128, 64);

    };

}