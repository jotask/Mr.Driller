/**
 * Created by Jose Vives on 28/08/2017.
 */
function Player(){

    const self = this;

    this.init = function() {

        self.oxygen = new Oxygen();
        self.jetpack = new JettPack();

        self.money = new Money();

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

        if(this.facing == 'idle'){
            if(this.player.body.velocity.x == 0  && this.player.body.velocity.y < 0)
            this.player.frame = 4;
        }

        // Jump action removed due the jetpack implementation
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
    };

    this.save = function(){
        self.pickaxe.save();
        self.money.save();
        self.inventory.save();
    };

    this.load = function(){
        self.pickaxe.load();
        self.money.load();
        self.inventory.load();
    };

}

function Oxygen(){

    const self = this;

    this.decrease = 1;

    this.level = 1;

    const SIZE = 20;

    const MAXVALUE = engine.game.width;

    const HEIGHT = engine.game.height - (SIZE * .5);

    var value = MAXVALUE;

    var oxy = engine.game.add.graphics();
    oxy.moveTo(0, HEIGHT);

    oxy.lineStyle(SIZE, 0x0000ff, 1);
    oxy.lineTo(value--, HEIGHT);

    oxy.fixedToCamera = true;

    this.update = function(){

        if(game.player.player.y < (game.world.config.offset * BLOCK_SIZE)){
            value = MAXVALUE;
            oxy.scale.x = ((value) / engine.game.width);
            return;
        }

        oxy.scale.x = ((value) / engine.game.width);

        value -= (self.decrease / self.level);

    };

    this.fill = function(){
        value = MAXVALUE;
        oxy.scale.x = 1;
    };

}

function JettPack(){

    const MAX = 200;
    const POWER = 80;

    const self = this;

    this.level = UpgradesItems.FUEL.level;
    this.decrease = 5;

    const SIZE = 20;

    const MAXVALUE = engine.game.width;

    var value = MAXVALUE;

    const HEIGHT = engine.game.height - (SIZE * .5) - 20;

    var oxy = engine.game.add.graphics();
    oxy.moveTo(0, HEIGHT);
    oxy.lineStyle(SIZE, 0xff6633, 1);
    oxy.lineTo(value, HEIGHT);

    oxy.fixedToCamera = true;

    var emitter = game.add.emitter(0, 0, 500);

    emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );

    emitter.gravity = 200;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(.25, 0, .25, 0, 500);

    emitter.start(false, 3000, 5);

    this.update = function(){

        emitter.on = false;

        const tmp = game.player.getMiddle();

        emitter.emitX = tmp[0];
        emitter.emitY = tmp[1];

        // engine.game.world.wrap(game.player.player, 64);

        if(game.player.cursors.up.isDown || game.player.jumpButton.isDown){


            if(value <= 0 && !GOD){
                return;
            }

            emitter.on = true;

            game.player.player.body.velocity.y -= POWER;

            if(game.player.player.body.velocity.y < -MAX){
                game.player.player.body.velocity.y = -MAX;
            }

            oxy.scale.x = ((value) / engine.game.width);

            value -= self.decrease / self.level;

        }

    };

    this.fill = function(){
        value = MAXVALUE;
        oxy.scale.x = 1;
    };

}