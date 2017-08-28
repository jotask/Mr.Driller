/**
 * Created by Jota on 28/08/2017.
 */
var menu = {

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