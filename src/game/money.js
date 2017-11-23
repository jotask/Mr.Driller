/**
 * Created by Jose Vives on 19/09/2017.
 */
function Money(){

    this.money = 0;

    this.save = function() {
        localStorage.setItem("money", this.money);
    };

    this.load = function(){
        this.money = localStorage.getItem("money") || 0;
    };

}