/**
 * Created by Jose Vives on 28/08/2017.
 */

const STATES = {
    LOAD: "load",
    MENU: "menu",
    GAME: "game"
};

const Blocks = {
    AIR: { id: -1, breakable: false, health: -1, weight: 1, value: 100, name: "Air"},
    GRASS: { id: 0, breakable: false, health: -1, weight: 1, value: 100, name: "Grass"},
    DIRT: { id: 1, breakable: true, health: 100, weight: 1, value: 100, name: "Dirt"},
    STONE: { id: 2, breakable: true, health: 100, weight: 1, value: 100, name: "Stone"},
    OBSIDIAN: { id: 3, breakable: false, health: -1, weight: 1, value: 100, name: "Obsidian"},
    SKY: { id: 4, breakable: true, health: 100, weight: 1, value: 100, name: "Sky"},
    WHITE: { id: 5, breakable: true, health: 100, weight: 1, value: 100, name: "White"},
    IRON: { id: 6, breakable: true, health: 200, weight: 1, value: 100, name: "Iron"},
    GOLD: { id: 7, breakable: true, health: 300, weight: 1, value: 100, name: "Gold"},
    FOSSIL: { id: 8, breakable: true, health: 300, weight: 1, value: 100, name: "Fossil"}
};

const ShopItems = {
    REFUEL: {price: 10, text: "Refuel", desc: "Fill your jetpack with fuel.", special: true, action: function(){ game.player.jetpack.fill(); }},
    OXYGEN: {price: 105, text: "Oxygen", desc: "Description.", special: true, action: function(){ game.player.oxygen.fill(); }}
};

const UpgradesItems = {
    FUEL: {price: 0, text: "Fuel tank", desc: "Increase the fuel your jetpack can carry on.", level: 1, action: function(){ game.player.jetpack.level = this.level; }},
    OXYGEN: {price: 50, text: "Oxygen", desc: "Increase the amount of oxygen.", level: 1, action: function(){ game.player.oxygen.level = this.level; }},
    PICKAXE: {price: 100, text: "Pickaxe", desc: "Increase the velocity of the pickaxe.", level: 1, action: function(){ game.player.pickaxe.level = this.level; }}
};

const Dinosaurs = {
    ONE: {id: 1, current: 0, price: 100, unlocked: true},
    TWO: {id: 2, current: 0, price: 0, unlocked: false},
    THREE: {id: 3, current: 0, price: 99, unlocked: false},
    FOUR: {id: 4, current: 0, price: 50, unlocked: false},
    FIVE: {id: 5, current: 0, price: 1000, unlocked: false},
    SIX: {id: 6, current: 0, price: 80, unlocked: false},
    SEVEN: {id: 7, current: 0, price: 100, unlocked: true},
    EIGHT: {id: 8,current: 0, price: 100, unlocked: false},
    NINE: {id: 9, current: 0, price: 600, unlocked: false}
};

const GOD = true;

const WIDTH = 640;
const HEIGHT = 480;

const BLOCK_SIZE = 32;

const INIT_STATE = STATES.GAME;