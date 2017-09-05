/**
 * Created by Jose Vives on 05/09/2017.
 */

//  Here is a custom game object
ItemEntity = function (_block) {

    Phaser.Sprite.call(this, engine.game, _block.x * BLOCK_SIZE + ( BLOCK_SIZE / 2), _block.y * BLOCK_SIZE + (BLOCK_SIZE / 2), 'blocks');

    this.frame = _block.type.id;

    this.start = [this.x, this.y];

    this.scale.setTo(0.5, 0.5);
    this.anchor.setTo(0.5, 0.5);

    this.rotateSpeed = Math.random();

    this.cnt = 0;

    engine.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.immovable = true;
    this.body.allowGravity = false;

};

ItemEntity.prototype = Object.create(Phaser.Sprite.prototype);
ItemEntity.prototype.constructor = ItemEntity;

/**
 * Automatically called by World.update
 */
ItemEntity.prototype.update = function() {

    this.angle += this.rotateSpeed;

    this.y += Math.cos(this.cnt);

    this.cnt += 0.15;

    engine.game.physics.arcade.overlap(this, game.player, this.collisionPlayer, null, this);

};

ItemEntity.prototype.collisionPlayer = function(){
    console.log("coool");
};