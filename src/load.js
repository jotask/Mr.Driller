/**
 * Created by Jota on 28/08/2017.
 */

var load = {

    init: function(){
        engine.assets.load();
    },

    create: function(){
        engine.game.physics.startSystem(Phaser.Physics.Arcade);
        engine.game.state.start(STATES.MENU);
    }


};