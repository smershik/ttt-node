'use strict'
const Game = require('./Game'); //not sure

class GameController{
    constructor(){
        this.games = [];
    }

    _addGame(game){
        this.games.push(game);
    }

    _getFreeGame(){
        for(let i=0; i<this.games.length; i++){
            if(this.games[i].players.length===1) return this.games[i];
        }
        return null;
    }

    join(player){
        let freeGame = this._getFreeGame();
        if(!freeGame){
            freeGame = new Game();
            this._addGame(freeGame);
        }
        freeGame.addPlayer(player);

        player.addEventHandler('game over',()=>{
            this.games.splice(this.games.indexOf(freeGame),1);
        });
    }


}

module.exports = GameController;