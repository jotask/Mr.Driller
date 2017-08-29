/**
 * Created by Jota on 29/08/2017.
 */

function Generation(_world) {

    var world = _world;

    this.generateWorld = function() {

        this.blocks = create2DArray(world.width);

        var data = '';
        for (var y = 0; y < world.height; y++) {

            for (var x = 0; x < world.width; x++) {
                var block = generateTile(x, y);
                data += block;

                this.blocks[x][y] = generateBlock(block);

                if (x < world.width - 1) {
                    data += ',';
                }
            }

            if (y < world.height - 1) {
                data += "\n";
            }

        }

        console.log(data);

        this.data = data;

    };

    var generateTile = function(x, y) {

        const offset = world.offset;

        if (y < offset) {
            return -1;
        } else if (y == 0 + offset) {
            return 0;
        } else if (y == (world.height - 1)) {
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