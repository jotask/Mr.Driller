/**
 * Created by Jose Vives on 28/08/2017.
 */
function Player(){

    const self = this;

    this.init = function() {

        self.oxygen = new Oxygen();
        self.jetpack = new JettPack();

        self.money = 100;

        self.player = engine.game.add.sprite(WIDTH / 2, 0, 'player');

        self.inventory = new Inventory();

        self.pickaxe = new Pickaxe(this);

        engine.game.physics.enable(self.player, Phaser.Physics.ARCADE);

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

        this.oxygen.update();
        this.jetpack.update();

        var b = self.player.body;

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

        // if(this.jumpButton.isDown && this.player.body.onFloor() && engine.game.time.now > this.jumpTimer){
        //     b.velocity.y = -360;
        //     this.jumpTimer = engine.game.time.now + 10;
        // }

        this.pickaxe.update();

    };

    this.getMiddle = function(){
        var x = this.player.x + (this.player.width / 2);
        var y = this.player.y + (this.player.height / 2);
        return [x, y];
    }

}

function Oxygen(){

    const self = this;
    this.decrease = 1;

    const SIZE = 20;

    const HEIGHT = engine.game.height - (SIZE * .5);

    var value = engine.game.width;

    // var bar = engine.game.add.graphics();
    // bar.beginFill(0xffffff, 0.25);
    // bar.drawRect(0, engine.game.height - SIZE, engine.game.width, SIZE);

    var oxy = engine.game.add.graphics();
    oxy.moveTo(0, HEIGHT);
    // oxy.beginFill(0x0000ff, 1);
    // oxy.drawRect(0, engine.game.height - SIZE, value, SIZE);
    oxy.lineStyle(SIZE, 0x0000ff, 1);
    oxy.lineTo(value--, HEIGHT);

    this.update = function(){

        if(game.player.player.y < (game.world.config.offset * BLOCK_SIZE)){
            value = engine.game.width;
            oxy.scale.x = ((value) / engine.game.width);
            return;
        }

        oxy.scale.x = ((value) / engine.game.width);

        value -= self.decrease;

    }

}

function JettPack(){

    const MAX = 200;
    const POWER = 80;

    const self = this;

    this.decrease = 1;

    const SIZE = 20;

    var value = engine.game.width;

    const HEIGHT = engine.game.height - (SIZE * .5) - 20;

    // var bar = engine.game.add.graphics();
    // bar.beginFill(0xffffff, 0.25);
    // bar.drawRect(0, engine.game.height - SIZE, engine.game.width, SIZE);

    var oxy = engine.game.add.graphics();
    oxy.moveTo(0, HEIGHT);
    // oxy.beginFill(0x0000ff, 1);
    // oxy.drawRect(0, engine.game.height - SIZE, value, SIZE);
    oxy.lineStyle(SIZE, 0xff6633, 1);
    oxy.lineTo(value--, HEIGHT);


    var emitter = game.add.emitter(0, 0, 500);

    emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );

    emitter.gravity = 200;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(.25, 0, .25, 0, 500);

    emitter.start(false, 3000, 5);

    this.update = function(){

        emitter.on = false;

        var px = game.player.player.body.velocity.x;
        var py = game.player.player.body.velocity.y;

        // px *= -1;
        // py *= -1;

        // emitter.minParticleSpeed.set(px, py);
        // emitter.maxParticleSpeed.set(px, py);

        const tmp = game.player.getMiddle();

        emitter.emitX = tmp[0];
        emitter.emitY = tmp[1];

        // emitter.forEachExists(game.world.wrap, game.world);
        engine.game.world.wrap(game.player.player, 64);

        if(game.player.cursors.up.isDown || game.player.jumpButton.isDown){


            if(value <= 0){
                return;
            }

            emitter.on = true;

            game.player.player.body.velocity.y -= POWER;

            if(game.player.player.body.velocity.y < -MAX){
                game.player.player.body.velocity.y = -MAX;
            }

            oxy.scale.x = ((value) / engine.game.width);
            value -= self.decrease;

        }

    }

}