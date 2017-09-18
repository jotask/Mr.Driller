/**
 * Created by Jose Vives on 06/09/2017.
 */

/**
 * Machines in game
 *
 * @constructor
 */
MachineInvestigation = function () {

    const x = 3 * BLOCK_SIZE;
    const y = game.world.config.offset * BLOCK_SIZE;

    Phaser.Sprite.call(this, engine.game, x, y, 'investigating');

    this.frame = 0;

    this.inputEnabled = true;

    this.events.onInputDown.add(this.showHud, this);

    const self = this;

    this.scale.setTo(2, 2);
    this.anchor.setTo(1, 1);

    engine.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.smoothed = false;

    engine.game.add.existing(this);

    this._hud = {
        offset: 5,
        group: null,
        bounds: new Phaser.Rectangle(0,0,0,0),
        bg: engine.game.add.sprite(-Number.MAX_VALUE,-Number.MAX_VALUE, 'selection')
    };


    this._selected = engine.game.add.graphics();
    this._selected.beginFill(0xffffff, 0.25);
    this._selected.drawRect(this.x - this.width, this.y - this.height, this.width, this.height);
    this._selected.visible = false;

    this.events.onInputOver.add(function(){
        self._selected.visible = true;
    });
    this.events.onInputOut.add(function(){
        self._selected.visible = false;
    });

};

MachineInvestigation.prototype = Object.create(Phaser.Sprite.prototype);
MachineInvestigation.prototype.constructor = MachineInvestigation;

MachineInvestigation.prototype.showHud = function(_obj){

    this._hud.group = engine.game.add.group();

    {
        var xx = 100;
        var yy = 100;
        var ww = WIDTH - xx * 2;
        var hh = HEIGHT - yy * 2;

        this._hud.bounds.setTo(xx, yy, ww, hh);

    }

    engine.game.paused = true;

    var bar = engine.game.add.graphics();
    bar.beginFill(0xffffff, 0.75);
    bar.drawRect(this._hud.bounds.x, this._hud.bounds.y, this._hud.bounds.width, this._hud.bounds.height);

    this._hud.group.add(bar);

    const off = 20;

    var style = { font: "bold 64px Arial", fill: "#0f0", boundsAlignH: "center", boundsAlignV: "middle"};
    var info = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Investigation", style);
    info.setTextBounds(off, off, this._hud.bounds.width - off * 2, this._hud.bounds.height - off * 2);
    this._hud.group.add(info);

    var style = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "right", boundsAlignV: "bottom"};

    var exit = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Close", style);
    exit.setTextBounds(off, off, this._hud.bounds.width - off * 2, this._hud.bounds.height - off * 2);
    exit.inputEnabled = true;
    exit.events.onInputDown.add(function(){
        _obj._hud.group.destroy();
        engine.game.paused = false;
    });
    exit.events.onInputOver.add(function(){
        exit.tint = 0x00ff00;
    });
    exit.events.onInputOut.add(function(){
        exit.tint = 0xffffff;
    });

    this._hud.group.add(exit);

};