/**
 * Created by Jota on 28/08/2017.
 */
function Player(){

    this.init = function() {

        this.player = engine.game.add.sprite(WIDTH / 2, 0, 'player');

        this.pickaxe = new Pickaxe(this);

        engine.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        var b = this.player.body;
        b.bounce.y = 0.2;
        b.collideWorldBounds = true;
        b.setSize(20, 32, 5, 16);

        var a = this.player.animations;
        a.add('left', [0, 1, 2, 3], 10, true);
        a.add('turn', [4], 20, true);
        a.add('right', [5, 6, 7, 8], 10, true);

        this.cursors = engine.game.input.keyboard.createCursorKeys();
        this.left = engine.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.right = engine.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.down = engine.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.jumpButton = engine.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.facing = "idle";
        this.player.frame = 4;

        this.jumpTimer = 0;

    };

    this.update = function(){

        engine.game.camera.follow(this.player);

        var b = this.player.body;

        b.velocity.x = 0;

        if(this.cursors.left.isDown || this.left.isDown){
            b.velocity.x = -150;
            if(this.facing != "left"){
                this.player.animations.play("left");
                this.facing = "left";
            }
        }else if(this.cursors.right.isDown || this.right.isDown){
            b.velocity.x = 150;
            if(this.facing != "right"){
                this.player.animations.play("right");
                this.facing = "right";
            }
        }else {
            if (this.facing != "idle") {
                this.player.animations.stop();

                if (this.facing == 'left') {
                    this.player.frame = 0;
                } else {
                    this.player.frame = 5;
                }

                this.facing = 'idle';
            }
        }

        if(this.jumpButton.isDown && this.player.body.onFloor() && engine.game.time.now > this.jumpTimer){
            b.velocity.y = -360;
            this.jumpTimer = engine.game.time.now + 10;
        }

        this.pickaxe.update();

    };

    this.getMiddle = function(){
        var x = this.player.x + (this.player.width / 2);
        var y = this.player.y + (this.player.height / 2);
        return [x, y];
    }

}

function Pickaxe(p){

    this.player = p;

    var a = engine.game.add.sprite(Number.MAX_VALUE, Number.MAX_VALUE, 'breaking');
    a.visible = false;

    var line = new Phaser.Line();
    const ppp = this.player.getMiddle();
    line.start.set(ppp[0], ppp[1]);
    line.end.set(ppp[0], ppp[1]);

    const MAX_DISTANCE = 70;

    var best = new Phaser.Rectangle(0,0,0,0);
    var selection = engine.game.add.sprite(best.x, best.y,'selection');

    var start = new Phaser.Point(0,0);

    const POWER = 5;

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

        const p = this.player.getMiddle();
        line.start.set(p[0], p[1]);
        start.setTo(p[0], p[1]);

        const e = engine.game.input.mousePointer;
        line.end.set(e.worldX, e.worldY);

        var tiles = game.world.layer.getRayCastTiles(line, 3, true, false);
        if(tiles.length > 0){

            const tile = getClosest(tiles);
            var middle = getTileMiddle(tile);
            var dst = distance(middle[0], middle[1], start.x, start.y);
            if(dst < MAX_DISTANCE) {
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

            if(mining.block === other){
                mining.health -= POWER;

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
            if(dst < MAX_DISTANCE) {
                game.world.pick(tile.x, tile.y);
                game.world.layer.dirty = true;
            }
        }

    };

    engine.game.input.onDown.add(press, this);
    engine.game.input.onUp.add(release, this);

}