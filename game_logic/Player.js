'use strict'

class Player {
    constructor (name,socket){
        this.name = name;
        this.socket = socket;
    }

    joinToRoom(roomId){
        this.socket.join(roomId);
        this.roomId = roomId;
        this.socket.on('disconnect',()=>{
            this.socket.broadcast.to(roomId).emit('escaped');
        });
    }

    emitEventInRoom(eventName,dataToSender=true, dataToOther=dataToSender){
        this.socket.to(this.roomId).emit(eventName, dataToOther);
        this.socket.emit(eventName, dataToSender);
    }

    emitEvent(eventName,data=true){
        this.socket.emit(eventName,data);
    }

    emitBroadcast(eventName,data){
        this.socket.to(this.roomId).emit(eventName,data);
    }

    addEventHandler(eventName,handler){
        this.socket.on(eventName,handler);
    }
}

module.exports = Player;
