/**
 * Created by Jota on 28/08/2017.
 */

var game = {

    init: function(){
        engine.game.stage.backgroundColor = '#fff';
        this.player = new Player();
        this.player.init();
        this.world = new World();
        this.world.init();
    },

    create: function(){

    },

    update: function(){
      this.player.update();
    }

};