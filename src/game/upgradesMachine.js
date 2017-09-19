/**
 * Created by Jose Vives on 08/09/2017.
 */

/**
 * Created by Jose Vives on 07/09/2017.
 */


/**
 * Machines in game
 *
 * @constructor
 */
UpgradesMachine = function () {

    const x = 17 * BLOCK_SIZE;
    const y = game.world.config.offset * BLOCK_SIZE;

    Phaser.Sprite.call(this, engine.game, x, y, 'upgrades');

    this.animations.add("run", [0, 1, 2, 3], 20, true);
    this.animations.play("run");

    this.inputEnabled = true;

    this.events.onInputDown.add(this.showHud, this);

    const self = this;

    this.scale.setTo(1.5, 1.5);
    this.anchor.setTo(0, 1);

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
    this._selected.drawRect(this.x, this.y - this.height, this.width, this.height);
    this._selected.visible = false;

    this.events.onInputOver.add(function(){
        if(!engine.game.paused)
            self._selected.visible = true;
    });

    this.events.onInputOut.add(function(){
        self._selected.visible = false;
    });

};

UpgradesMachine.prototype = Object.create(Phaser.Sprite.prototype);
UpgradesMachine.prototype.constructor = UpgradesMachine;

UpgradesMachine.prototype.showHud = function(_obj){

    if(engine.game.paused){
        return;
    }

    this._selected.visible = false;

    this._hud.group = engine.game.add.group();

    {
        var xx = 10;
        var yy = 10;
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

    const SIEZ = 50;

    var i = 0;

    const st1 = { font: '30px Arial' };
    const st2 = { font: '15px Arial' };

    for(var tmp in UpgradesItems){

        var c = UpgradesItems[tmp];

        const x = this._hud.bounds.x + off;
        const y = this._hud.bounds.y + off + i;
        const w = this._hud.bounds.width - (off * 2);
        const h = SIEZ;

        var button = engine.game.make.button(x, y, null, itemClicked, this, 2, 1, 0);
        button.width = w;
        button.height = h;
        button.input.priorityID = Number.MAX_VALUE;

        var bg = engine.game.add.graphics();
        bg.beginFill(0xff0000, 0.5);
        bg.drawRect(button.x, button.y, button.width, button.height);

        this._hud.group.add(button);
        this._hud.group.add(bg);

        var txt = engine.game.add.text(x + 5, y + 8, c["text"], st1);
        var dsc = engine.game.add.text(x + 125, y + 20, c["desc"], st2);
        dsc.wordWrap = true;
        dsc.wordWrapWidth = 250;
        var price = engine.game.add.text(x + 350, y + 8, c["price"] + "$");

        var lvl = engine.game.add.text(x + 450, y + 8, "Level: " + c["level"]);

        button.itemId = c;
        button.itemLevel = lvl;
        button.itemPrice = price;

        this._hud.group.add(txt);
        this._hud.group.add(dsc);
        this._hud.group.add(price);
        this._hud.group.add(lvl);

        i += SIEZ + off * .5;

    }

    var style = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "left", boundsAlignV: "bottom" };
    var money = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Money: " + game.player.money.money, style);
    money.setTextBounds(off, off, this._hud.bounds.width - off * 2, this._hud.bounds.height - off * 2);

    exit.input.priorityID = Number.MAX_VALUE;

    this._hud.group.add(exit);
    this._hud.group.add(money);

    engine.game.world.bringToTop(this._hud.group);
    this._hud.group.inputEnableChildren = true;

    function itemClicked(_obj){
        const item = _obj.itemId;

        if(item.price > game.player.money.money){
            notEnoughtMoney(money);
            return;
        }

        if(item.special){
            console.log(item);
        }

        game.player.money.money -= item.price;

        money.setText("Money: " + game.player.money.money + "$");

        item.level++;
        item.price = test(item.price);
        _obj.itemPrice.setText(item.price + "$");

        item.action();

    }

    function test(_value){
        console.log(++_value);
        return _value;
    }

    function notEnoughtMoney(_tag){

        if(this.quake != undefined)
            if(this.quake.isRunning)
                return;

        // define the camera offset for the quake
        var rumbleOffset = 10;

        // we need to move according to the camera's current position
        var properties = {
            x: _tag.x - rumbleOffset
        };

        // we make it a really fast movement
        var duration = 100;

        // because it will repeat
        var repeat = 4;

        // we use bounce in-out to soften it a little bit
        var ease = Phaser.Easing.Bounce.InOut;
        var autoStart = false;
        // a little delay because we will run it indefinitely
        var delay = 0;
        // we want to go back to the original position
        var yoyo = true;

        this.quake = game.add.tween(_tag).to(properties, duration, ease, autoStart, delay, 4, yoyo);

        // let the earthquake begins
        this.quake.start();

    }

};