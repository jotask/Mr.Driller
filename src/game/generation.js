/**
 * Created by Jose Vives on 29/08/2017.
 */

function WorldConfig(){

    this.width = (WIDTH / BLOCK_SIZE);
    this.height = 50;

    this.offset = 5;

    this.seed = Math.random();

}

function Generation(_cfg) {

    var config = _cfg;

    var perlin = new Perlin(config.seed);

    this.generateWorld = function() {

        this.blocks = create2DArray(config.width);

        for (var y = 0; y < config.height; y++) {
            for (var x = 0; x < config.width; x++) {
                var block;
                if(y < config.offset){
                    block = new Block(x, y, Blocks.AIR);
                }else{
                    block = generateBlock(x, y);
                }
                this.blocks[x][y] = block;
            }

        }

        makeEntrance(this.blocks);

        var data = '';
        for (var y = 0; y < config.height; y++) {
            for (var x = 0; x < config.width; x++) {
                data += this.blocks[x][y].type.id;
                if (x < config.width - 1)
                    data += ',';
            }
            if (y < config.height - 1)
                data += "\n";
        }

        this.data = data;

    };

    var makeEntrance = function(data){

        const middle = Math.round(config.width / 2) + 3;

        const deep = 3;
        const size = 1;

        for (var y = config.offset; y < config.offset + deep; y++) {
            for (var x = middle - size; x <= middle + 1 ; x++) {
                if(y == config.offset + deep - 1) {
                    data[x][y].type = Blocks.GRASS;
                }else{
                    data[x][y].type = Blocks.AIR;
                }
            }
        }

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
            const rnd = Math.random();
            if(rnd < 0.33){
                return new Block(x, y, Blocks.IRON);
            }else if(rnd < 0.66){
                return new Block(x, y, Blocks.FOSSIL);
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