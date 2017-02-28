'use strict'
const guid = require('guid');

class Game{
    constructor(){
        this.players = [];
        this.id  = guid.create();
        this.moveNumber = 0;
        this.gameField = {
            1:null,
            2:null,
            3:null,
            4:null,
            5:null,
            6:null,
            7:null,
            8:null,
            9:null
        };
    }

    setPlayersMarkers(){
        this.players[0].marker = Math.round(Math.random())===0?'o':'x';
        this.players[1].marker = this.players[0].marker==='o'?'x':'o';
    }

    addPlayer(player){
        if (this.players.length===2) throw new Error('too many players in room');

        this.players.push(player);
        player.joinToRoom(this.id);
        if(this.players.length===1)
            player.emitEvent('waiting');

        if(this.players.length===2){
            this.setPlayersMarkers();
            this.players.forEach( (item)=>{
                this.startGame(item);
            });
        }
    }

    startGame(player){
        player.emitEvent('startgame',(player.marker==='x'?true:false));
        player.addEventHandler('move',this.moveHandler(player));
    }

    sendMoveInfo(){
        let player0 = this.players[0];
        let player1 = this.players[1];

        let curr = this.moveNumber%2===0?'x':'o';

        player0.marker===curr?player0.emitEventInRoom('move info',true,player0.name):
            player1.emitEventInRoom('move info',true,player1.name);
    }


    isYourMove(marker) {
        return (this.moveNumber % 2 === 0 && marker === 'x')||(this.moveNumber % 2 === 1 && marker === 'o');
    };

    checkWin(marker){
        for(let i=1; i<=3; i++){
            if(this.gameField[i]===this.gameField[i+3]&&this.gameField[i]===this.gameField[i+6]&&this.gameField[i]===marker)
                return true;
        }
        for(let i =1; i<=7; i+=3){
            if(this.gameField[i]===this.gameField[i+1]&&this.gameField[i]===this.gameField[i+2]&&this.gameField[i]===marker)
                return true;
        }
        if(this.gameField[1]===this.gameField[5]&&this.gameField[1]===this.gameField[9]&&this.gameField[1]===marker)
            return true;
        if(this.gameField[3]===this.gameField[5]&&this.gameField[3]===this.gameField[7]&&this.gameField[3]===marker)
            return true;
        return false;
    }

    isCellFree(cellNumber){
        return this.gameField[cellNumber]===null?true:false;
    }

    moveHandler(player){
        return (cellNumber,callback)=> {
            if (this.isYourMove(player.marker)) {
                if (this.isCellFree(cellNumber)) {
                    this.gameField[cellNumber] = player.marker;
                    this.moveNumber++;
                    player.emitBroadcast('moved', {cellNumber: cellNumber, marker: player.marker});
                    callback(true);
                    if (this.moveNumber === Object.keys(this.gameField).length)
                        player.emitEventInRoom('dead heat', true);
                    else
                    if (this.checkWin(player.marker))
                        player.emitEventInRoom('winner', true, false);
                    else
                        this.sendMoveInfo();
                }
            } else {
                callback(false);
            }
        }
    }

}

module.exports = Game;