/**
 * Created by Jota on 28/08/2017.
 */
function Player(){

    this.init = function() {
        this.player = engine.game.add.sprite(WIDTH / 2, 100, 'player');

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

        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

        this.facing = "idle";
        this.player.frame = 4;

        this.jumpTimer = 0;

    };

    this.update = function(){

        engine.game.camera.follow(this.player);
        /*
        var tile = game.world.isGrounded(this.player);
        engine.game.physics.arcade.collide(this.player, tile);
        */

        var b = this.player.body;

        // console.log(b.blocked.down);

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

        if(this.down.isDown){
            game.world.mining(this.player);
        }

        if(this.jumpButton.isDown && this.player.body.onFloor() && engine.game.time.now > this.jumpTimer){
            b.velocity.y = -360;
            this.jumpTimer = engine.game.time.now + 10;
        }
        // if(this.jumpButton.isDown ){
        //     b.velocity.y = -250;
        //     this.jumpTimer = engine.game.time.now + 10;
        // }

    }

}