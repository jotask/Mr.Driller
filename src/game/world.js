/**
 * Created by Jota on 28/08/2017.
 */
function World(){

    const BLOCK_SIZE = 32;

    const w = (WIDTH / BLOCK_SIZE);
    const height = 15;

    const offset = 5;

    this.init = function(){

        engine.game.physics.arcade.gravity.y = 1000;

        this.bg = engine.game.add.tileSprite(0,-200,800, 600, 'background');
        engine.game.stage.backgroundColor = '#000000';

        const caca = w;

        this.blocks = Create2DArray(w) ;

        var data = '';
        for (var y = 0; y < height; y++) {

            for (var x = 0; x < caca; x++) {
                var block = generateTile(x, y);
                data += block;

                this.blocks[x][y] = generateBlock(block);

                if (x < caca - 1)
                {
                    data += ',';
                }
            }

            if (y < height - 1)
            {
                 data += "\n";
            }

        }

        console.log(data);

        //  Add data to the cache
        engine.game.cache.addTilemap('map', null, data, Phaser.Tilemap.CSV);

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
        var bounds = new Phaser.Rectangle(0, 0, WIDTH, (BLOCK_SIZE * height));
        engine.game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = engine.game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    };

    var generateBlock = function(blockID){
        var b = new Block();
        if(blockID === 3){
            b.break = false;
        }
        return b;
    };

    var generateTile = function(x, y) {

        if(y < offset){
            return -1;
        } else if(y == 0 + offset){
            return 0;
        }else if( y == (height - 1)){
            return 3;
        }
        //return game.rnd.between(1,2).toString();
        return 1;
    };

    this.prev = null;

    this.mining = function(player){
        const x = Math.round( (player.x ) / BLOCK_SIZE);
        const y = Math.round( (player.y + BLOCK_SIZE ) / BLOCK_SIZE);

        var tile = this.map.getTile(x, y, this.layer);
        var block = this.blocks[x][y];

        if(!tile)
            return;

        if(!block){
            console.error("block is null");
            return;
        }

        if(block.break){
            this.map.removeTile(x, y, this.layer);
        }else{
            console.error("nono");
        }

    };

    this.checkCollision = function(player) {
        game.physics.arcade.collide(player, this.layer);
    }

}

function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}

function Block() {
    this.break = true;
}