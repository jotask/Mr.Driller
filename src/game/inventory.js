/**
 * Created by Jose Vives on 03/09/2017.
 */

function Inventory() {

    const MAX_ITEMS = 10;
    // TODO implement weight system for the inventory
    const MAX_WEIGHT = MAX_ITEMS;

    var items = [];

    var inventoryMenu = {
        offset: 5,
        group: null,
        bounds: new Phaser.Rectangle(0,0,0,0),
        bg: engine.game.add.sprite(-Number.MAX_VALUE,-Number.MAX_VALUE, 'selection')
    };

    var pause_label = game.add.text(WIDTH - 120, 20, 'Inventory', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(showInventory);
    engine.game.input.onDown.add(hideInventory, self);

    this.update = function(){

    };

    this.render = function() {

    };

    this.pickUp = function(_block) {
        if (items.length > MAX_ITEMS) {
            console.log("inventory full");
        }else {
            for (var i = 0; i < MAX_ITEMS; i++) {
                var tmp = items[i];
                if(tmp == undefined){
                    continue;
                }
                if (tmp.block.id == _block.type.id) {
                    tmp.quantity++;
                    console.log(_block.type.id + " item added in position: " + i + ". Quantity : " + items[i].quantity);
                    return;
                }
            }
            // If is not found add the item into the array in the first empty slot
            for (var i = 0; i < MAX_ITEMS; i++) {
                if(items[i] == undefined){
                    items[i] = new Item(_block.type);
                    items[i].quantity++;
                    console.log("Item created into inventory");
                    return;
                }
            }
        }

        console.log("something is wrong");

    };

    this.delete = function(_block){
        for (var i = 0; i < items.length; i++) {
            var tmp = items[i];
            if(tmp.block.id == _block.id){
                tmp.quantity--;

                if(tmp.quantity < 1){
                    delete items[i];
                    console.log("item deleted", items[i]);
                }

                console.log("item found in inventory and removed one");
            }
        }
        console.log("item not found");
    };

    for(var i = 0; i < 10; i++){
        var rnd = Math.round(Math.random() * 10);

        var type = Blocks.DIRT;

        if(rnd < 2){
            type = Blocks.GOLD;
        }else if(rnd < 4){
            type = Blocks.IRON;
        }else if(rnd < 6){
            type = Blocks.GRASS;
        }else if(rnd < 7){
            type = Blocks.OBSIDIAN;
        }

        console.log(rnd);

        var block = new Block(0,0,type);
        this.pickUp(block);
    }

    function showInventory(){

        inventoryMenu.group = engine.game.add.group();

        {
            var xx = 100;
            var yy = 100;
            var ww = WIDTH - xx * 2;
            var hh = HEIGHT - yy * 2;

            inventoryMenu.bounds.setTo(xx, yy, ww, hh);
            inventoryMenu.bg.x = xx;
            inventoryMenu.bg.y = yy;
            inventoryMenu.bg.width = ww;
            inventoryMenu.bg.height = hh;

        }

        // When the pause button is pressed, we pause the game
        engine.game.paused = true;

        // Then add the menu
        // menu = game.add.sprite(WIDTH/2, HEIGHT/2, 'menu');
        // menu.anchor.setTo(0.5, 0.5);
        // inventoryMenu.create(WIDTH / 2, HEIGHT / 2, 'breaking');
        // inventoryMenu.anchor.setTo(0.5, 0.5);

        const w = (inventoryMenu.bounds.width) / (5);
        const h = (inventoryMenu.bounds.height) / (3);

        var x = inventoryMenu.bounds.x + 4;
        var y = inventoryMenu.bounds.y + 5;

        for(var i = 0; i < MAX_ITEMS; i++) {

            var tmp = undefined;

            tmp = items[i];

            if(!tmp){
                continue;
            }

            var button = engine.game.make.button(x, y, 'button', function removeGroup() {}, this, 2, 1, 0);
            button.width = w;
            button.height = h;

            var number = engine.game.add.text(x, y, tmp.quantity, { font: '30px Arial', fill: '#f00' });

            var img = engine.game.add.sprite(x + 3, y + 3, 'blocks');
            img.width = w - 7 - 3;
            img.height = h - 8 - 3;
            img.smoothed = false;

            img.frame = tmp.block.id;

            // button.scale.setTo(0.5, 1);
            // button.onInputOver.add(over, this);
            // button.onInputOut.add(out, this);
            // button.onInputDown.add(actionOnClick, this);

            // game.input.onDown.addOnce(removeGroup, this);

            inventoryMenu.group.add(img);
            inventoryMenu.group.add(button);
            inventoryMenu.group.add(number);

            if(MAX_ITEMS / 2 == i + 1){
                y += h;
                x = inventoryMenu.bounds.x;
            }else{
                x += w;
            }


        }

        inventoryMenu.bg.visible = true;

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        // choiseLabel = game.add.text(WIDTH/2, HEIGHT-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        // choiseLabel.anchor.setTo(0.5, 0.5);

    }

    // function removeGroup() {
        // game.world.remove(inventoryMenu);
        // group.destroy();
    // }

    // function over() { console.log('button over'); }
    // function out() { console.log('button out'); }
    // function actionOnClick () { console.log('button clicked'); }

    function hideInventory(event){
        // Only act if paused
        if(engine.game.paused){
            // Calculate the corners of the menu
            // var x1 = WIDTH/2 - 270/2, x2 = WIDTH/2 + 270/2,
            //     y1 = HEIGHT/2 - 180/2, y2 = HEIGHT/2 + 180/2;
            var x1 = inventoryMenu.bounds.x;
            var x2 = x1 + inventoryMenu.bounds.width;
            var y1 = inventoryMenu.bounds.x;
            var y2 = y1 + inventoryMenu.bounds.height;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                // choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{

                // Remove the menu and the label
                inventoryMenu.group.destroy();
                // choiseLabel.destroy();

                inventoryMenu.bg.visible = false;

                // Unpause the game
                engine.game.paused = false;
            }
        }
    }

}

function Item(_block){
    this.block = _block;
    this.quantity = 0;
}