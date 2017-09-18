/**
 * Created by Jose Vives on 03/09/2017.
 */
function Pickaxe(_p){

    const self = this;

    var player = _p;
    this.MAX_DISTANCE = 70;
    this.POWER = 100;

    var a = engine.game.add.sprite(Number.MAX_VALUE, Number.MAX_VALUE, 'breaking');
    a.visible = false;

    var line = new Phaser.Line();
    const ppp = player.getMiddle();
    line.start.set(ppp[0], ppp[1]);
    line.end.set(ppp[0], ppp[1]);

    var best = new Phaser.Rectangle(0,0,0,0);
    var selection = engine.game.add.sprite(best.x, best.y,'selection');

    var start = new Phaser.Point(0,0);

    var mining = {
        block: null,
        health: Number.MAX_VALUE,
        pressed: false
    };

    var press = function(){
        var x = selection.x / BLOCK_SIZE;
        var y = selection.y / BLOCK_SIZE;

        if(x < 0 || y < 0)
            return;

        mining.pressed = true;
        mining.block = game.world.blocks[x][y];
        mining.health = mining.block.type.health;

        a.visible = true;

    };

    var release = function() {
        mining.pressed = false;
        mining.block = null;
        mining.health = Number.MAX_VALUE;
        a.frame = 0;
        a.visible = false;
    };

    this.update = function(){

        const p = player.getMiddle();
        line.start.set(p[0], p[1]);
        start.setTo(p[0], p[1]);

        const e = engine.game.input.mousePointer;
        line.end.set(e.worldX, e.worldY);

        var tiles = game.world.layer.getRayCastTiles(line, 3, true, false);
        if(tiles.length > 0){

            const tile = getClosest(tiles);
            var middle = getTileMiddle(tile);
            var dst = distance(middle[0], middle[1], start.x, start.y);
            if(dst < this.MAX_DISTANCE) {
                best.setTo(tile.x * BLOCK_SIZE, tile.y * BLOCK_SIZE, tile.width, tile.height);
                selection.x = best.x;
                selection.y = best.y;
            }else{
                best.setTo(-100,-100,0,0);
                selection.x = best.x;
                selection.y = best.y;}
        }else{

            best.setTo(-100,-100,0,0);
            selection.x = best.x;
            selection.y = best.y;
        }

        breakme: if(mining.pressed){

            var x = selection.x / BLOCK_SIZE;
            var y = selection.y / BLOCK_SIZE;

            if(x < 0 || y < 0) {
                release();
                break breakme;
            }

            var other = game.world.blocks[x][y];

            if(!other.type.breakable){
                release();
                break breakme;
            }

            if(mining.block === other){
                mining.health -= self.POWER;

                var percentage = calculatePercentage(mining.block, mining.health);

                if(percentage < .25){
                    a.frame = 3;
                }else if(percentage < .5){
                    a.frame = 2;
                }else if(percentage < .75){
                    a.frame = 1;
                }else if(percentage < 1){
                    a.frame = 0;
                }

                if(mining.health < 0){
                    raycast();
                    release();
                    press();
                }
            }else{
                release();
                press();
            }
        }

        a.x = selection.x;
        a.y = selection.y;

    };

    var calculatePercentage = function(block, current){
        var a = 100 * current;
        var b = a / block.type.health;
        return b / 100;
    };

    var getClosest = function(tiles){

        const x = line.start.x;
        const y = line.start.y;

        var result = tiles[0];
        var min = Number.MAX_VALUE;

        for(var i = 0; i < tiles.length; i++){
            const tile = tiles[i];
            var middle = getTileMiddle(tile);
            var dst = distance(middle[0], middle[1], x, y);
            if(dst < min){
                min = dst;
                result = tile;
            }
        }
        return result;
    };

    var distance = function(a, b, x, y){
        var one = Math.pow( ( a - x ) , 2);
        var two = Math.pow( ( b - y ) , 2);
        return Math.sqrt(one + two);
    };

    var getTileMiddle = function(tile){
        var x = tile.worldX + (tile.width / 2);
        var y = tile.worldY + (tile.height / 2);
        return [x, y];
    };

    var raycast = function() {

        var tiles = game.world.layer.getRayCastTiles(line, 3, true, false);

        if (tiles.length > 0) {
            var tile = getClosest(tiles);
            var center = getTileMiddle(tile);
            var dst = Math.abs(Math.round(distance(center[0],center[1] ,start.x, start.y)));
            if(dst < self.MAX_DISTANCE) {
                game.world.pick(tile.x, tile.y);
                game.world.layer.dirty = true;
            }
        }

    };

    engine.game.input.onDown.add(press, this);
    engine.game.input.onUp.add(release, this);

}