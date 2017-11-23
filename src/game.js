/**
 * Created by Jose Vives on 28/08/2017.
 */

var game = {

    init: function(){
        engine.game.stage.backgroundColor = '#fff';

        this.world = new World();
        this.world.init();

        this.opt = new Options();
        this.inv = new MachineInvestigation();
        this.shop = new Shop();
        this.upg = new UpgradesMachine();

        this.player = new Player();
        this.player.init();
        
    },

    create: function(){
        this.inv.load();
        this.shop.load();
        this.upg.load();
        this.player.load();
    },

    update: function(){
        this.world.checkCollision(this.player.player);
        this.player.update();
    },

    render: function() {

        if (engine.game.paused) {
            engine.game.tweens.update();
            engine.game.particles.update();
        }

        engine.game.debug.text(this.game.time.fps, 8, 16, 0x00ff00);
    },

    shutdown: function(){
        this.world.save();
        this.inv.save();
        this.shop.save();
        this.upg.save();
        this.player.save();
    }

};