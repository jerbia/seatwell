/**
 * Created by guybal on 9/18/14.
 */
$(function (){
//    var serverUrl = "http://54.68.6.239:3000/isSitting";
//    var serverUrlWebSocket = "ws://54.68.6.239:3000/";

    var serverUrl = "http://:3000/isSitting";
    var serverUrlWebSocket = "ws://:3000/";

    var totalClock = $('.total-clock').FlipClock({
        autoStart:false
    });

    var tableObject = $('.time-table');
//    var sessionClock = $('.session-clock').FlipClock({
//        autoStart:false
//    });

    var app = new Seatwell(serverUrl,totalClock);
    var socket = io();

    socket.on('connect', function() {
       console.log("connected and on");
    });

    socket.on('message', function(msg) {
        app.updateClock(msg);
    });

});

var Seatwell = function(serverUrl,clockObject,tableObject) {
    this.serverUrl = serverUrl;
    this.clockObject = clockObject;
    this.tableObject = tableObject;
    //this.instance = instance;
    //this.updateFromServer(this);

};

Seatwell.prototype = {

    updateClock: function(isStting, sittingTime) {
        this.clockObject.setTime(sittingTime);
        this.tableObject.text(sittingTime);
    },


    updateFromServer: function(instance) {
        $.getJSON(this.serverUrl,
        function(data) {
            console.log(data);
            instance.updateClock(data.isSitting,data.sittingTime);
        })

        t = setTimeout(this.updateFromServer(instance),1000)();
    }

};