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

        const caca = w;

        var data = '';
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < caca; x++)
            {
                data += generateTile(x, y);

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
        this.blocks = this.map.createLayer(0, WIDTH, HEIGHT);
        // this.blocks.debug = true;

        // Create custom bounds
        var bounds = new Phaser.Rectangle(0, 0, WIDTH, (BLOCK_SIZE * height));
        engine.game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = engine.game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

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

    this.minning = function(player){
        const x = Math.round( (player.x ) / BLOCK_SIZE);
        const y = Math.round( (player.y + BLOCK_SIZE ) / BLOCK_SIZE);
        // game.physics.arcade.collide(player, this.layer, removeTile);

        this.map.removeTile(x, y, this.blocks);

    };

    this.checkCollision = function(player) {
        game.physics.arcade.collide(player, this.blocks);
    }

}