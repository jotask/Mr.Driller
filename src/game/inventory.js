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
        bounds: new Phaser.Rectangle(0,0,0,0)
        // ,
        // bg: engine.game.add.sprite(-Number.MAX_VALUE,-Number.MAX_VALUE, 'selection')
    };

    var pause_label = game.add.text(WIDTH - 120, 20, 'Inventory', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(showInventory);

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

    // for(var i = 0; i < 10; i++){
    //     var rnd = Math.round(Math.random() * 10);
    //
    //     var type = Blocks.DIRT;
    //
    //     if(rnd < 2){
    //         type = Blocks.GOLD;
    //     }else if(rnd < 4){
    //         type = Blocks.IRON;
    //     }else if(rnd < 6){
    //         type = Blocks.GRASS;
    //     }else if(rnd < 7){
    //         type = Blocks.OBSIDIAN;
    //     }
    //
    //     console.log(rnd);
    //
    //     var block = new Block(0,0,type);
    //     this.pickUp(block);
    // }

    function showInventory(){

        if(engine.game.paused){
            return;
        }

        inventoryMenu.group = engine.game.add.group();

        {
            var xx = 100;
            var yy = 100;
            var ww = WIDTH - xx * 2;
            var hh = HEIGHT - yy * 2;

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

        for(var i = 0; i < MAX_ITEMS; i++) {

            var tmp = undefined;

            tmp = items[i];

            if(!tmp){
                continue;
            }

            var button = engine.game.make.button(x, y, 'button', function removeGroup() {}, this, 2, 1, 0);
            button.width = w;
            button.height = h;

            button.input.priorityID = Number.MAX_VALUE;

            var number = engine.game.add.text(x, y, tmp.quantity, { font: '30px Arial', fill: '#f00' });

            var img = engine.game.add.sprite(x + 3, y + 3, 'blocks');
            img.width = w - 7 - 3;
            img.height = h - 8 - 3;

            img.frame = tmp.block.id;

            img.smoothed = false;

            inventoryMenu.group.add(button);
            inventoryMenu.group.add(img);
            inventoryMenu.group.add(number);

            if(MAX_ITEMS / 2 == i + 1){
                y += h;
                x = inventoryMenu.bounds.x;
            }else{
                x += w;
            }


        }

        var style = { font: "bold 32px Arial", fill: "#f00", boundsAlignH: "center", boundsAlignV: "middle" };

        var exit = engine.game.add.text(inventoryMenu.bounds.x, inventoryMenu.bounds.y, "close", style);
        exit.setTextBounds(inventoryMenu.bounds.x, inventoryMenu.bounds.y, inventoryMenu.bounds.width, inventoryMenu.bounds.height);
        exit.inputEnabled = true;
        exit.events.onInputDown.add(hideInventory);

        inventoryMenu.group.add(exit);

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

function Item(_block){
    this.block = _block;
    this.quantity = 0;
}