'use strict'
let socket = io.connect();

$(document).ready(function(){
	socket.emit('create player',{name: name});

	socket.on('escaped',function(){
        gameOver('Your enemy escaped');
	    socket.emit('game over');
	    socket.disconnect();
    })
    .on('waiting',function(){
	   $('#game-status').text('Waiting for other player...');
    })
    .on('move info',function(data){
        if(data===true) {
            $('#game-status').text('Your move...');
        }else{
            $('#game-status').text(data+ '`s move...');
        }
    }).on('moved',function(data){
        (data.marker==='x'?moveX:moveO)(data.cellNumber);
    }).on('winner',function(data){
        data?gameOver('You win!!'):gameOver('You loose.');
        socket.emit('game over');
        socket.disconnect();
    }).on('dead heat',function(){
        gameOver('dead heat');
        socket.emit('game over');
        socket.disconnect();
    }).on('startgame',function(data){
        console.log(data);
	    let turn = data?moveX:moveO;
        $('#game-status').text(data?'Your marker is "X"':'Your marker is "O"');
	    $('.game-cell').on('click',function(){
            let cellNumber = $(this).attr('cell-number');
            socket.emit('move',cellNumber,function(status){
                if(status){
                    turn(cellNumber);
                }else{
                    $('#game-status').text('Not your move');
                }
            });
        });

    });

});


function moveX(cellNumber){
    $('.game-cell[cell-number='+cellNumber+']').addClass('turn-x');
};

function moveO(cellNumber){
    $('.game-cell[cell-number='+cellNumber+']').addClass('turn-o');
};


function gameOver(message){
    $('.game-container').detach();
    $('#game-status').text(message);
};
