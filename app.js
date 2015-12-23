var WebSocketClient = require('websocket').client;
var request = require("request");

var toiletOccupied = false;
var urinalOccupied = false;
 
var clientUrinal = new WebSocketClient();
var clientToilet = new WebSocketClient();

function memeIt(occupied){
    var meme = {
        imageUrl: null,
        text: "Powered by ATM, because privacy is overrated"
    };

    console.log("Toilet Occupied:", toiletOccupied,  " - ", "Urinal Occupied:", urinalOccupied);

    if (toiletOccupied && urinalOccupied){
        meme.imageUrl = "/images/all_red.png";
    } else if (!toiletOccupied && !urinalOccupied){
        meme.imageUrl = "/images/all_green.png";
    } else if (toiletOccupied && !urinalOccupied){
        meme.imageUrl = "/images/t_red_u_green.png";
    } else if (!toiletOccupied && urinalOccupied){
        meme.imageUrl = "/images/t_green_u_red.png";
    }

    request({ 
        url: "http://localhost:2500", 
        method: 'PUT', 
        json: meme}, 
        function(){console.log("Request succesfull")});

}


clientToilet.on('connect', function(connection) {
    console.log('WebSocket Toilet Client Connected');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            toiletOccupied = JSON.parse(message.utf8Data).occupied;
            memeIt();
        }
    });
});
 
clientToilet.connect('ws://52.62.29.150:8080/level/4/room/male/slot/1/subscribe');


clientUrinal.on('connect', function(connection) {
    console.log('WebSocket Urinal Client Connected');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            urinalOccupied = JSON.parse(message.utf8Data).occupied;
            memeIt();
        }
    });

});
 
clientUrinal.connect('ws://52.62.29.150:8080/level/4/room/male/slot/2/subscribe');