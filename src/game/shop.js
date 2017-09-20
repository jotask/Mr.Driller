/**
 * Created by Jose Vives on 07/09/2017.
 */

// TODO
// https://phaser.io/examples/v2/input/button-open-popup

/**
 * Machines in game
 *
 * @constructor
 */
Shop = function () {

    const x = 6 * BLOCK_SIZE;
    const y = game.world.config.offset * BLOCK_SIZE;

    Phaser.Sprite.call(this, engine.game, x, y, 'shop');

    this.animations.add("run", [0, 1, 2, 3], 20, true);
    this.animations.play("run");
    this.animations.currentAnim.speed = 5;

    this.inputEnabled = true;

    this.events.onInputDown.add(this.openHud, this);

    const self = this;

    this.scale.setTo(1.5, 1.5);
    this.anchor.setTo(0, 1);

    engine.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.smoothed = false;

    engine.game.add.existing(this);

    this.test = 23;

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

Shop.prototype = Object.create(Phaser.Sprite.prototype);
Shop.prototype.constructor = Shop;

Shop.prototype.closeHud = function (){
    this.shop._hud.group.destroy();
    engine.game.paused = false;
};

Shop.prototype.openHud = function (_shop){

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
    exit.events.onInputDown.add(this.closeHud, { shop: _shop });
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

    for(var tmp in ShopItems){

        var c = ShopItems[tmp];

        const x = this._hud.bounds.x + off;
        const y = this._hud.bounds.y + off + i;
        const w = this._hud.bounds.width - (off * 2);
        const h = SIEZ;

        var button = engine.game.make.button(x, y, null, itemClicked, this, 2, 1, 0);
        button.width = w;
        button.height = h;
        button.input.priorityID = Number.MAX_VALUE;


        var bg = engine.game.add.graphics();

        var color = 0xff0000;

        if(game.player.money.money >= c["price"]){
            color = 0x00ff00;
        }

        bg.beginFill(color, 0.5);
        bg.drawRect(button.x, button.y, button.width, button.height);

        button.bg = bg;

        this._hud.group.add(button);
        this._hud.group.add(bg);

        var txt = engine.game.add.text(x + 5, y + 8, c["text"], st1);
        var dsc = engine.game.add.text(x + 125, y + 20, c["desc"], st2);
        var price = engine.game.add.text(x + 350, y + 8, c["price"] + "$");

        if(c["special"]){
            price.setText(calculateValue(c["price"]) + "$");
        }

        button.itemId = c;
        button.itemPrice = price;

        this._hud.group.add(txt);
        this._hud.group.add(dsc);
        this._hud.group.add(price);

        i += SIEZ + off * .5;

    }

    {
        // Creating all the items in inventory

        var x = this._hud.bounds.x + off;
        var y = this._hud.bounds.y + off + i;
        var w = this._hud.bounds.width - (off * 2);
        var h = SIEZ * 5;

        var inventory = engine.game.add.group();

        var bar = engine.game.add.graphics();
        bar.beginFill(0xffffff, 0.75);
        bar.drawRect(x,y,w,h);

        inventory.add(bar);

        const width = w / 6;
        const height = h / 3;

        var items = game.player.inventory.items;

        const MAX_ITEMS = 10;

        for(var i = 0; i < MAX_ITEMS; i++) {

            var tmp = undefined;

            tmp = items[i];

            if(!tmp){
                continue;
            }

            var button = engine.game.make.button(x, y, 'button', function removeGroup() {}, this, 2, 1, 0);
            button.width = width;
            button.height = height;

            button.onInputOver.add(function(_obj){
                var item = _obj.item;
                var val = item.quantity * item.block.value;
                var s = "Click for sell " + item.quantity + " of " +  item.block.name + " for " + val + "$.";
                text.setText(s);
            }, this);

            button.onInputOut.add(function(){
                text.setText("Click any item to sell it.");
            }, this);

            button.onInputUp.add( sellItem ,{ btn: button, shop: _shop });

            button.input.priorityID = Number.MAX_VALUE;

            // TODO align text
            var number = engine.game.add.text(x + 60, y + 50, tmp.quantity, { font: '30px Arial', fill: '#f00' });

            button.item = tmp;

            var img = engine.game.add.sprite(x + 3, y + 3, 'blocks');
            img.width = width - 7 - 3;
            img.height = height - 8 - 3;

            img.frame = tmp.block.id;

            img.smoothed = false;

            button.img = img;
            button.number = number;

            inventory.add(button);
            inventory.add(img);
            inventory.add(number);

            if(MAX_ITEMS / 2 == i + 1){
                y += height;
                x = this._hud.bounds.x + off;
            }else{
                x += width;
            }

        }

        var yyy = this._hud.bounds.height - 100;

        var text = engine.game.add.text(this._hud.bounds.x + off * 1.5, yyy, "Click any item to sell it.");
        text.visible = true;

        inventory.add(text);

        this._hud.group.add(inventory);

    }

    var style = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "left", boundsAlignV: "bottom" };
    var money = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Money: " + game.player.money.money + "$", style);
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

        game.player.money.money -= item.price;

        money.setText("Money: " + game.player.money.money + "$");

        item.level++;

        item.action();

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

    function calculateValue(_value){

        const max = engine.game.width;

        const other = _value * (_value / max);

        return _value;

    }

    function sellItem(){
        var item = this.btn.item;
        game.player.money.money += item.quantity * item.block.value;
        game.player.inventory.delete(item, item.quantity);
        this.btn.number.destroy();
        this.btn.img.destroy();
        this.btn.destroy();

        this.shop._hud.group.destroy();
        engine.game.paused = false;

        this.shop.openHud(this.shop);

    }

};