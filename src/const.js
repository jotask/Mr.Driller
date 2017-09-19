/**
 * Created by Jose Vives on 28/08/2017.
 */

const STATES = {
    LOAD: "load",
    MENU: "menu",
    GAME: "game"
};

const Blocks = {
    AIR: { id: -1, breakable: false, health: -1, weight: 1},
    GRASS: { id: 0, breakable: false, health: -1, weight: 1},
    DIRT: { id: 1, breakable: true, health: 100, weight: 1},
    STONE: { id: 2, breakable: true, health: 100, weight: 1},
    OBSIDIAN: { id: 3, breakable: false, health: -1, weight: 1},
    SKY: { id: 4, breakable: true, health: 100, weight: 1},
    WHITE: { id: 5, breakable: true, health: 100, weight: 1},
    IRON: { id: 6, breakable: true, health: 200, weight: 1},
    GOLD: { id: 7, breakable: true, health: 300, weight: 1},
    FOSSIL: { id: 8, breakable: true, health: 300, weight: 1}
};

const ShopItems = {
    REFUEL: {price: 10, text: "Refuel", desc: "Fill your jetpack with fuel.", special: true, action: function(){ game.player.jetpack.fill(); }},
    OXYGEN: {price: 100, text: "Oxygen", desc: "Description.", special: true, action: function(){ game.player.oxygen.fill(); }}
};

const UpgradesItems = {
    FUEL: {price: 100, text: "Fuel tank", desc: "Increase the fuel your jetpack can carry on.", level: 1, action: function(){ game.player.jetpack.level = this.level; }},
    OXYGEN: {price: 100, text: "Oxygen", desc: "Increase the amount of oxygen.", level: 1, action: function(){ game.player.oxygen.level = this.level; }},
    PICKAXE: {price: 100, text: "Pickaxe", desc: "Increase the velocity of the pickaxe.", level: 1, action: function(){ game.player.pickaxe.level = this.level; }}
};

const Dinosaurs = {
    ONE: {id: 1},
    TWO: {id: 2},
    THREE: {id: 3}
};

const GOD = true;

const WIDTH = 640;
const HEIGHT = 480;

const BLOCK_SIZE = 32;

const INIT_STATE = STATES.GAME;