/**
 * Created by Jota on 28/08/2017.
 */

const STATES = {
    LOAD: "load",
    MENU: "menu",
    GAME: "game"
};

const Blocks = {
    AIR: { id: -1, breakable: false},
    GRASS: { id: 0, breakable: true},
    DIRT: { id: 1, breakable: true},
    STONE: { id: 2, breakable: true},
    OBSIDIAN: { id: 3, breakable: false},
    SKY: { id: 4, breakable: true},
    WHITE: { id: 5, breakable: true},
    IRON: { id: 6, breakable: true},
    GOLD: { id: 7, breakable: true}
};

const WIDTH = 640;
const HEIGHT = 480;

const BLOCK_SIZE = 32;

const INIT_STATE = STATES.GAME;