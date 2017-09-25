/**
 * Created by Jose Vives on 28/08/2017.
 */

var load = {

    // TODO
    // https://phaser.io/examples/v2/tweens/repeat

    init: function(){

    },

    preload: function(){
        engine.game.load.image('space', 'assets/starfield.png', 138, 15);
        engine.game.load.image('logo', 'assets/phaser2.png');
    },

    create: function(){

        engine.game.add.tileSprite(0, 0, 800, 600, 'space');

        var sprite = engine.game.add.sprite(engine.game.world.centerX, engine.game.world.centerY, 'logo');

        sprite.anchor.setTo(0.5, 0.5);
        sprite.alpha = 0;

        //  Create our tween. This will fade the sprite to alpha 1 over the duration of 2 seconds
        var tween = engine.game.add.tween(sprite).to( { alpha: .75 }, 1000, "Linear", true);

        //  And this tells it to yoyo, i.e. fade back to zero again before repeating.
        //  The 3000 tells it to wait for 3 seconds before starting the fade back.
        tween.yoyo(true, 0);

        //  And this tells it to repeat, i.e. fade in again 10 times.
        //  The 1000 tells it to wait for 1 second before restarting the fade.
        tween.repeat(Number.MAX_VALUE, 0);

        engine.assets.load();

        var load = engine.game.load;

        load.onLoadStart.add(loadStart, this);
        load.onFileComplete.add(fileComplete, this);
        load.onLoadComplete.add(loadComplete, this);

        load.start();

        engine.game.physics.startSystem(Phaser.Physics.Arcade);
    }

};


function loadStart() {
    // console.log("Loading ...");
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    // console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
}

function loadComplete() {
    // console.log("Load Complete");
    engine.game.state.start(INIT_STATE);
}