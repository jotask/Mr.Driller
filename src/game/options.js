/**
 * Created by Jose Vives on 09/11/2017.
 */

function Options() {


    const self = this;

    this.items = [];

    var inventoryMenu = {
        offset: 5,
        group: null,
        bounds: new Phaser.Rectangle(0,0,0,0)
    };

    var pause_label = game.add.text(20, 20, 'Options', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(showOptions);
    pause_label.fixedToCamera = true;

    function showOptions(){

        if(engine.game.paused){
            return;
        }

        inventoryMenu.group = engine.game.add.group();

        {

            var xx = 100;
            var yy = 100;
            var ww = (WIDTH - xx * 2);
            var hh = (200);

            inventoryMenu.bounds.setTo(xx, yy, ww, hh);

        }

        engine.game.paused = true;

        var bar = engine.game.add.graphics();
        bar.beginFill(0xffffff, 0.75);
        bar.drawRect(inventoryMenu.bounds.x, inventoryMenu.bounds.y, inventoryMenu.bounds.width, inventoryMenu.bounds.height);

        inventoryMenu.group.add(bar);

        const w = (inventoryMenu.bounds.width) / (5);
        const h = (inventoryMenu.bounds.height) / (3);

        var x = inventoryMenu.bounds.x + 4;
        var y = inventoryMenu.bounds.y + 5;

        const SPACE = 50;
        var z = 0;

        const style = { font: "bold 42px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};

        var textone = engine.game.add.text(x, y, "Continue", style);
        textone.setTextBounds(0, SPACE * z++, inventoryMenu.bounds.width, 100);
        textone.inputEnabled = true;
        textone.events.onInputOver.add(function(){ textone.tint = 0x00ff00; });
        textone.events.onInputOut.add(function(){ textone.tint = 0xffffff; });
        textone.events.onInputDown.add(hideInventory);
        inventoryMenu.group.add(textone);

        var texttwo = engine.game.add.text(x, y, "Save", style);
        texttwo.setTextBounds(0, SPACE * z++, inventoryMenu.bounds.width, 100);
        texttwo.inputEnabled = true;
        texttwo.events.onInputOver.add(function(){ textone.tint = 0x00ff00; });
        texttwo.events.onInputOut.add(function(){ textone.tint = 0xffffff; });
        inventoryMenu.group.add(texttwo);

        var textthree = engine.game.add.text(x, y, "Back to Menu", style);
        textthree.setTextBounds(0, SPACE * z++, inventoryMenu.bounds.width, 100);
        textthree.inputEnabled = true;
        textthree.events.onInputOver.add(function(){ textone.tint = 0x00ff00; });
        textthree.events.onInputOut.add(function(){ textone.tint = 0xffffff; });
        textthree.events.onInputDown.add(function(){
            engine.game.paused = false;
            engine.game.state.start(STATES.MENU);
        });
        inventoryMenu.group.add(textthree);

    }

    function hideInventory(event){

        if(engine.game.paused){
            var x1 = inventoryMenu.bounds.x;
            var x2 = x1 + inventoryMenu.bounds.width;
            var y1 = inventoryMenu.bounds.y;
            var y2 = y1 + inventoryMenu.bounds.height;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                console.log("Clicked inside");
            }

            inventoryMenu.group.destroy();
            engine.game.paused = false;

        }

    }

}