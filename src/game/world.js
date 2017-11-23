/**
 * Created by Jose Vives on 28/08/2017.
 */
function World(){

    this.config = new WorldConfig();

    const self = this;

    this.init = function(){

        self.deleted = [];

        engine.game.physics.arcade.gravity.y = 1000;

        self.bg = engine.game.add.tileSprite(0,-200,800, 600, 'background');
        engine.game.stage.backgroundColor = '#000000';

        self.load();

        // Create custom bounds
        var bounds = new Phaser.Rectangle(0, 0, WIDTH, (BLOCK_SIZE * this.config.height));
        engine.game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = engine.game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    };


    var generateWorld = function(data, blocks){

        self.data = data;
        self.blocks = blocks;

        //  Add data to the cache
        engine.game.cache.addTilemap('map', null, data, Phaser.Tilemap.CSV);

        //  Create our map (the 16x16 is the tile size)
        self.map = engine.game.add.tilemap('map', BLOCK_SIZE, BLOCK_SIZE);

        //  'tiles' = cache image key, 16x16 = tile size
        self.map.addTilesetImage('tiles', 'tiles', BLOCK_SIZE, BLOCK_SIZE);

        // this.map.setCollisionBetween(0,4);
        self.map.setCollisionByExclusion([4, 5]);

        //  0 is important
        self.layer = self.map.createLayer(0, WIDTH, HEIGHT);
        // self.layer.debug = true;
    };

    this.pick = function(x, y, spawn){

        var tile = self.map.getTile(x, y, this.layer);
        var block = self.blocks[x][y];

        if(!tile) {
            console.error("[world.js::64] tile is null");
            return;
        }

        if(!block){
            console.error("[world.js::69] block is null");
            return;
        }

        if(block.type.breakable){

            // game.player.inventory.pickUp(block);
            self.deleted.push( {x: x, y: y} );

            if(!spawn)
                new ItemEntity(block);

            // TODO set the block to empty
            // this.blocks[x][y] = Blocks.AIR;
            self.map.removeTile(x, y, this.layer);
        }

    };

    this.checkCollision = function(_enitity) {
        game.physics.arcade.collide(_enitity, self.layer);
    };

    this.load = function(){

        var data = localStorage.getItem("world_data");
        var blocks = localStorage.getItem("world_block");
        var deleted = localStorage.getItem("world_deleted");

        if(!data || !blocks){
            var gen = new Generation(this.config);
            gen.generateWorld();
            blocks = gen.blocks;
            data = gen.data;
            deleted = [];
        }else{
            data = JSON.parse(data);
            blocks = JSON.parse(blocks);
            deleted = JSON.parse(deleted);
        }

        generateWorld(data, blocks);

        for(var i = 0; i < deleted.length; i++){
            var tmp = deleted[i];
            self.pick(tmp.x, tmp.y, true);
        }

    };

    this.save = function(){
        localStorage.setItem("world_data", JSON.stringify(self.data));
        localStorage.setItem("world_block", JSON.stringify(self.blocks));
        localStorage.setItem("world_deleted", JSON.stringify(self.deleted));
    };

}

function Block(x, y, _type){
    this.x = x;
    this.y = y;
    this.type = _type;
}