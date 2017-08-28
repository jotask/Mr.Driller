/**
 * Created by Jota on 28/08/2017.
 */

var game = {

    init: function(){
        engine.game.stage.backgroundColor = '#fff';
        this.world = new World();
        this.world.init();

        this.player = new Player();
        this.player.init();
    },

    create: function(){

    },

    update: function(){
        this.world.checkCollision(this.player.player);
        this.player.update();
    },

    render: function(){
        engine.game.debug.text(this.game.time.fps, 8, 16, 0x00ff00);
    }

};