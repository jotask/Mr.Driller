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

        engine.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

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
        this.pickaxe.render();

    };

    this.getMiddle = function(){
        var x = this.player.x + (this.player.width / 2);
        var y = this.player.y + (this.player.height / 2);
        return [x, y];
    }

}

function Pickaxe(p){

    this.player = p;

    this.line = new Phaser.Line();
    const ppp = this.player.getMiddle();
    this.line.start.set(ppp[0], ppp[1]);
    this.line.end.set(ppp[0], ppp[1]);
    this.bounds = [];
    this.points = [];
    for(var i = 0; i < 20; i++) {
        this.bounds[i] = new Phaser.Rectangle(0, 0, 0, 0);
        this.points[i] = new Phaser.Point(0, 0);
    }

    // engine.game.input.onDown.add(startLine, this);
    // engine.game.input.onUp.add(raycast, this);

    engine.game.input.onTap.add(raycast, this);

    var best = new Phaser.Rectangle(0,0,0,0);

    var start = new Phaser.Point(0,0);

    this.update = function(){

        const p = this.player.getMiddle();
        this.line.start.set(p[0], p[1]);
        start.setTo(p[0], p[1]);

        const e = engine.game.input.mousePointer;
        this.line.end.set(e.worldX, e.worldY);

        var tiles = game.world.layer.getRayCastTiles(this.line, 3, true, false);
        if(tiles.length > 0){
            for(var i = 0; i < this.bounds.length; i++){
                if(tiles[i]) {
                    var t = tiles[i];
                    var middle = getTileMiddle(t);
                    this.bounds[i].setTo(t.x * BLOCK_SIZE, t.y * BLOCK_SIZE, t.width, t.height);
                    this.points[i].setTo(middle[0], middle[1]);
                }else{
                    this.bounds[i].setTo(0,0,0,0);
                    this.points[i].setTo(0,0);
                }
            }
            const caca = this.getClosest(tiles);
            best.setTo(caca.x * BLOCK_SIZE, caca.y * BLOCK_SIZE, t.width, t.height);
        }else{
            for(var i = 0; i < this.bounds.length; i++){
                this.bounds[i].setTo(0,0,0,0);
                this.points[i].setTo(0,0);
            }
            best.setTo(0,0,0,0);
        }

    };

    this.getClosest = function(tiles){

        const x = this.line.start.x;
        const y = this.line.start.y;

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

    function raycast() {

        var tiles = game.world.layer.getRayCastTiles(this.line, 3, true, false);

        if (tiles.length > 0)
        {
            var tile = this.getClosest(tiles);
            var center = getTileMiddle(tile);
            tile.debug = true;
            var dst = Math.abs(Math.round(distance(center[0],center[1] ,start.x, start.y)));
            if(dst < 70) {
                game.world.pick(tile.x, tile.y);
                game.world.layer.dirty = true;
            }
        }

    }

    this.render = function(){
        engine.game.debug.geom(this.line);

        for(var i = 0; i < 20; i++) {
            engine.game.debug.geom(this.bounds[i]);
            engine.game.debug.geom(this.points[i], "#ff0000");
        }
        engine.game.debug.geom(best, '#0fffff');
        engine.game.debug.geom(start, '#ff0000');
    }

}