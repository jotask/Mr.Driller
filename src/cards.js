/**
 * Created by Jose Vives on 23/11/2017.
 */
var cards = {

    create: function(){
        var style = {fill: 'white', align: 'center', boundsAlignH: 'center', boundsAlignV:'middle'};
        this. play = engine.game.add.text(0, 0, 'Start', style);
        this.play.inputEnabled = true;
        this.play.setTextBounds(0, 280, WIDTH, 100);


        this.play.events.onInputUp.add(function(){
            engine.game.state.start(STATES.GAME);
        });

    },

    preRender: function(){
        engine.game.debug.geom(this.play.textBounds);
    }

};