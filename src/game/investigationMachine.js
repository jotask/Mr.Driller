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

    this.events.onInputDown.add(this.openHud, this);

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
        if(!engine.game.paused)
            self._selected.visible = true;
    });
    this.events.onInputOut.add(function(){
        self._selected.visible = false;
    });

};

MachineInvestigation.prototype = Object.create(Phaser.Sprite.prototype);
MachineInvestigation.prototype.constructor = MachineInvestigation;

MachineInvestigation.prototype.closeHud = function() {
    this.obj._hud.group.destroy();
    engine.game.paused = false;
};

MachineInvestigation.prototype.openHud = function(_obj){

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

    var style = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "right", boundsAlignV: "bottom"};
    var style2 = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "left", boundsAlignV: "bottom"};

    const off = 10;
    var exit = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Close", style);
    exit.setTextBounds(off, off, this._hud.bounds.width - off * 2, this._hud.bounds.height - off * 2);
    exit.inputEnabled = true;
    exit.events.onInputDown.add(this.closeHud, { obj: _obj });
    exit.events.onInputOver.add(function(){
        exit.tint = 0x00ff00;
    });
    exit.events.onInputOut.add(function(){
        exit.tint = 0xffffff;
    });
    this._hud.group.add(exit);

    var info = engine.game.add.text(this._hud.bounds.x, this._hud.bounds.y, "Fossils: " + getFossilsAvailable(), style2);
    info.setTextBounds(off, off, this._hud.bounds.width - off * 2, this._hud.bounds.height - off * 2);
    info.inputEnabled = true;
    // info.events.onInputDown.add(this.closeHud, { obj: _obj });
    info.events.onInputOver.add(function(){
        info.tint = 0x00ff00;
    });
    info.events.onInputOut.add(function(){
        exit.tint = 0xffffff;
    });
    this._hud.group.add(info);

    var yyy = this._hud.bounds.height - 100;
    var text = engine.game.add.text(this._hud.bounds.x + off * 1.5, yyy, "Click a card to buy it.");
    this._hud.group.add(text);
    text.visible = true;

    const MANY = { x: 4, y: 2 };
    const SIEZ = { x: 128, y: 64 };

    var x = this._hud.bounds.x + 4;
    var y = this._hud.bounds.y + 5;

    var i = 0;
    var j = 0;
    for(var tmp in Dinosaurs){

        var c = Dinosaurs[tmp];

        var OFF = { x: 0, y: 0};
        if( i != 0 ){
            OFF.x = 10 * i;
        }
        if(j != 0 ){
            OFF.y = 10 * j;
        }

        var button = engine.game.make.button(x + OFF.x + (i * SIEZ.x), y + OFF.y + ( j * SIEZ.y), null, null, this, 2, 1, 0);
        button.width = SIEZ.x;
        button.height = SIEZ.y;
        button.input.priorityID = Number.MAX_VALUE;

        button.dinosaur = c;

        button.onInputUp.add(itemClicked, { btn: button, hud: _obj });
        button.onInputOver.add(over, {btn: button, txt: text });
        button.onInputOut.add(out, {btn: button, txt:text });

        //var bg = engine.game.add.graphics();

        //var color = Phaser.Color.getRandomColor();

        //bg.beginFill(color, 1);

        //bg.drawRect(button.x, button.y, button.width, button.height);

        this._hud.group.add(button);
        //this._hud.group.add(bg);

        var img = engine.game.add.sprite( x + OFF.x + (i * SIEZ.x), y + OFF.y + ( j * SIEZ.y) , 'factcards');
        img.width = 128;
        img.height = 64;

        if(!c.unlocked) {
            img.frame = 0;
        }else{
            img.frame = 1;
        }


        button.img = img;

        this._hud.group.add(img);

        button.itemId = c;

        i++;

        if(i >= MANY.x){
            i = 0;
            j++;
        }

    }

    /*
    const progressBar = {
        bounds: new Phaser.Rectangle(this._hud.bounds.x + off, 300, this._hud.bounds.width - off * 2, 100),
        progress: engine.game.add.graphics(),
        group: engine.game.add.group()
    };

    var barIn = engine.game.add.graphics();
    barIn.beginFill(0xff0000, .25);
    barIn.drawRect(progressBar.bounds.x, progressBar.bounds.y, progressBar.bounds.width, progressBar.bounds.height);

    const offset = 10;
    const pos = {
        x: progressBar.bounds.x + 10,
        y: progressBar.bounds.y + offset,
        w: progressBar.bounds.width - offset * 2,
        h: progressBar.bounds.height - offset * 2
    };

    var p = progressBar.progress;
    p.anchor.setTo(0.5, 0.5);
    p.beginFill(0x00ff00, .5);
    p.drawRect(pos.x, pos.y, pos.w, pos.h);

    progressBar.group.add(barIn);
    progressBar.group.add(p);

    progressBar.group.visible = false;

    this._hud.group.add(progressBar.group);
    */

    function itemClicked(){

        var dino = this.btn.dinosaur;

        /*
        if(dino.current >= dino.price){
            console.log("return");
            return;
        }else
            */

        const fossilsAvailable = getFossilsAvailable();

        if(fossilsAvailable <= 0){
            return;
        }else if( ! (dino.price <= fossilsAvailable) )
        {
            return;
        }

        removeFossilsAvailable( dino.price );

        dino.unlocked = true;

        //dino.current++;
        // removeFossilsAvailable();

        this.hud._hud.group.destroy();
        engine.game.paused = false;

        this.hud.openHud(this.hud);

    }

    function over (){

        var dino = this.btn.dinosaur;
        var text = this.txt;

        const fossils = getFossilsAvailable();

        var isEnough = (dino.price <= fossils);

        // console.log(game.player.money.money, isEnough);

        if(isEnough) {
            text.setText("Buy this card for " + dino.price + " fossils.");
        }else{
            var moneyLeft = dino.price - fossils ;
            text.setText("You need " + moneyLeft + " more fossils to unlock this card.");
        }


        // var p = (( dino.current / 100 ) / (dino.price)) * 100;

        // TODO fix the progress bar possition

        // console.log(p);
        /*
        progressBar.progress.scale.setTo(p, 1);

        progressBar.group.visible = true;
        */

    }

    function out(){
        var text = this.txt;
        text.setText("Click a card to buy it.");
        /*
        progressBar.group.visible = false;
        progressBar.progress.scale.setTo(1, 1);
        */
    }

    function getFossilsAvailable(){
        var tmp = 0;
        var items = game.player.inventory.items;

        for(i = 0; i < items.length; i++){
            var f = items[i];
            if(Blocks.FOSSIL.id == f.block.id)
                return f.quantity;
        }
        return tmp;
    }

    function removeFossilsAvailable(n){

        var items = game.player.inventory.items;

        for(i = 0; i < items.length; i++){
            var f = items[i];
            if(Blocks.FOSSIL.id == f.block.id){
                f.quantity -= n;
                return;
            }
        }

    }

    /*
    function removeFossilsAvailable(){

        var items = game.player.inventory.items;

        for(i = 0; i < items.length; i++){
            var f = items[i];
            if(Blocks.FOSSIL.id == f.block.id){
                f.quantity--;
                return;
            }
        }

        return tmp;
    }
    */

};