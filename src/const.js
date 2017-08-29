/**
 * Created by Jota on 28/08/2017.
 */

const STATES = {
    LOAD: "load",
    MENU: "menu",
    GAME: "game"
};

const Blocks = {
    GRASS: 0,
    DIRT: 1,
    STONE: 2,
    GRAVEL: 3,
    SKY: 4,
    WHITE: 5

};

const WIDTH = 640;
const HEIGHT = 480;

const BLOCK_SIZE = 32;

const INIT_STATE = STATES.GAME;