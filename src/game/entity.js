/**
 * Created by Jose Vives on 05/09/2017.
 */

/**
 * Item on the floor
 *
 * @param _block
 * @constructor
 */

//  Here is a custom game object
ItemEntity = function (_block) {

    Phaser.Sprite.call(this, engine.game, _block.x * BLOCK_SIZE + ( BLOCK_SIZE / 2), _block.y * BLOCK_SIZE + (BLOCK_SIZE / 2), 'blocks');

    this.frame = _block.type.id;

    this.scale.setTo(0.5, 0.5);
    this.anchor.setTo(0.5, 0.5);

    this.rotateSpeed = Math.random();

    this.block = _block;

    engine.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.immovable = true;
    this.body.allowGravity = true;

    this.body.bounce.set(0.5);

    engine.game.add.existing(this);

};

ItemEntity.prototype = Object.create(Phaser.Sprite.prototype);
ItemEntity.prototype.constructor = ItemEntity;

/**
 * Automatically called by World.update
 */
ItemEntity.prototype.update = function() {

    this.angle += this.rotateSpeed;

    engine.game.physics.arcade.overlap(this, game.player.player, this.collisionHandler, null, this);

    game.world.checkCollision(this);

};

ItemEntity.prototype.collisionHandler = function(){
    game.player.inventory.pickUp(this.block);
    this.kill();
};