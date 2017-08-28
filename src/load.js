/**
 * Created by Jota on 28/08/2017.
 */

var load = {

    init: function(){
        engine.assets.load();

        var load = engine.game.load;

        load.onLoadStart.add(loadStart, this);
        load.onFileComplete.add(fileComplete, this);
        load.onLoadComplete.add(loadComplete, this);

        load.start();

    },

    create: function(){
        engine.game.physics.startSystem(Phaser.Physics.Arcade);
    }

};


function loadStart() {
    // console.log("Loading ...");
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
}

function loadComplete() {
    // console.log("Load Complete");
    engine.game.state.start(INIT_STATE);
}