/**
 * Created by Jose Vives on 29/08/2017.
 */

function WorldConfig(){

    this.width = (WIDTH / BLOCK_SIZE);
    this.height = 15;

    this.offset = 5;

    this.seed = Math.random();

}

function Generation(_cfg) {

    var config = _cfg;

    var perlin = new Perlin(config.seed);

    this.generateWorld = function() {

        this.blocks = create2DArray(config.width);

        var data = '';

        for (var y = 0; y < config.height; y++) {
            for (var x = 0; x < config.width; x++) {

                var block;

                if(y < config.offset){
                    block = new Block(x, y, Blocks.AIR);
                }else{
                    block = generateBlock(x, y);
                }

                data += block.type.id;
                this.blocks[x][y] = block;

                // var block = generateTile(x, y);
                // data += block;
                //
                // this.blocks[x][y] = generateBlock(block);

                if (x < config.width - 1) {
                    data += ',';
                }
            }

            if (y < config.height - 1) {
                data += "\n";
            }

        }

        // console.log(data);

        this.data = data;

    };

    var generateBlock = function(x, y) {

        const scale = 3;

        // noise.simplex2 and noise.perlin2 for 2d noise
        var noise = perlin.noise(x / scale, y / scale, 0);


        if(y == config.offset){
            return new Block(x, y, Blocks.GRASS);
        }else if(y == (config.height - 1)){
            return new Block(x, y, Blocks.OBSIDIAN);
        }

        if(noise < .5){
            if(Math.random() < .5){
                return new Block(x, y, Blocks.IRON);
            }
            return new Block(x, y, Blocks.GOLD);
        }

        return new Block(x, y, Blocks.DIRT);

    };



    var create2DArray = function(rows) {

        var arr = [];

        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }

        return arr;

    }

}