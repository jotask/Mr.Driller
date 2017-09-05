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
    GRASS: { id: 0, breakable: true, health: 100, weight: 1},
    DIRT: { id: 1, breakable: true, health: 100, weight: 1},
    STONE: { id: 2, breakable: true, health: 100, weight: 1},
    OBSIDIAN: { id: 3, breakable: false, health: -1, weight: 1},
    SKY: { id: 4, breakable: true, health: 100, weight: 1},
    WHITE: { id: 5, breakable: true, health: 100, weight: 1},
    IRON: { id: 6, breakable: true, health: 200, weight: 1},
    GOLD: { id: 7, breakable: true, health: 300, weight: 1}
};

const WIDTH = 640;
const HEIGHT = 480;

const BLOCK_SIZE = 32;

const INIT_STATE = STATES.GAME;