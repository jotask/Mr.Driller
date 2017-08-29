/**
 * Created by Jota on 29/08/2017.
 */

function WorldConfig(){

    this.width = (WIDTH / BLOCK_SIZE);
    this.height = 15;

    this.offset = 5;

}

function Generation(_cfg) {

    var config = _cfg;

    this.generateWorld = function() {

        this.blocks = create2DArray(config.width);

        var data = '';
        for (var y = 0; y < config.height; y++) {

            for (var x = 0; x < config.width; x++) {
                var block = generateTile(x, y);
                data += block;

                this.blocks[x][y] = generateBlock(block);

                if (x < config.width - 1) {
                    data += ',';
                }
            }

            if (y < config.height - 1) {
                data += "\n";
            }

        }

        console.log(data);

        this.data = data;

    };

    var generateTile = function(x, y) {

        const offset = config.offset;

        if (y < offset) {
            return -1;
        } else if (y == 0 + offset) {
            return 0;
        } else if (y == (config.height - 1)) {
            return 3;
        }
        //return game.rnd.between(1,2).toString();
        return 1;

    };

    var generateBlock = function(blockID) {
        var b = new Block();
        if (blockID === 3) {
            b.break = false;
        }
        return b;
    };

    var create2DArray = function(rows) {

        var arr = [];

        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }

        return arr;

    }

}