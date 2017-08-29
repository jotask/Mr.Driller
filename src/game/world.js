/**
 * Created by Jota on 28/08/2017.
 */
function World(){

    this.config = new WorldConfig();

    this.init = function(){

        engine.game.physics.arcade.gravity.y = 1000;

        this.bg = engine.game.add.tileSprite(0,-200,800, 600, 'background');
        engine.game.stage.backgroundColor = '#000000';

        var gen = new Generation(this.config);
        gen.generateWorld();

        this.blocks = gen.blocks;
        this.data = gen.data;

        //  Add data to the cache
        engine.game.cache.addTilemap('map', null, this.data, Phaser.Tilemap.CSV);

        //  Create our map (the 16x16 is the tile size)
        this.map = engine.game.add.tilemap('map', BLOCK_SIZE, BLOCK_SIZE);

        //  'tiles' = cache image key, 16x16 = tile size
        this.map.addTilesetImage('tiles', 'tiles', BLOCK_SIZE, BLOCK_SIZE);

        // this.map.setCollisionBetween(0,4);
        this.map.setCollisionByExclusion([ 4, 5 ]);

        //  0 is important
        this.layer = this.map.createLayer(0, WIDTH, HEIGHT);
        // this.layer.debug = true;

        // Create custom bounds
        var bounds = new Phaser.Rectangle(0, 0, WIDTH, (BLOCK_SIZE * this.config.height));
        engine.game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = engine.game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    };

    this.pick = function(x, y){

        var tile = this.map.getTile(x, y, this.layer);
        var block = this.blocks[x][y];

        if(!tile) {
            console.error("[world.js::64] tile is null");
            return;
        }

        if(!block){
            console.error("[world.js::69] block is null");
            return;
        }

        if(block.break){
            this.map.removeTile(x, y, this.layer);
        }

    };

    this.checkCollision = function(player) {
        game.physics.arcade.collide(player, this.layer);
    }

}

function Block() {
    this.break = true;
}