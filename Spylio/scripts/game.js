// game.js

var startlat = 0.0;
var startlon = 0.0;

var dataurl = "http://nirvanutest.cloudapp.net/";
var registerEnd = "";
var g_timeout = 5000;

$(document).ready(startup());

function register(phonenumber, name, callback) {
    var OK = false;
    registerEnd = callback;
    var data = "?";

    getData("register", data, registerOK, registerFail);
    return OK;
}

function registerOK(data, textStatus, XMLHttpRequest) {
    var result = false;
    if (data != null) {
        var res = data;
        result = true;
    }
    registerEnd(result);
}

function registerFail(XMLHttpRequest, textStatus, thrownError) {
    registerEnd(false);
}

function startup() {
    if (checkForGeolocate()) {
        register("1234", "me", function (result) {
            var x = 0;
        });
        setInterval(function () { getLocation(); }, 3000);
    }
}

function checkForGeolocate() {
    var locationOK = false;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setStartLocation);
        locationOK = true;
    } else {
        $("#demo").text("Geolocation is not supported by this browser.");
    }
    return locationOK;
}

function setStartLocation(position) {
    startlat = position.coords.latitude;
    startlon = position.coords.longitude;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $("#demo").text("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    $("#demo").html("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude +
    "<br>Distance: " + calculateDistance(startlat,startlon, position.coords.latitude, position.coords.longitude)
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};

function getData(pid, s, succeed, fail) {
    var url = dataurl + "tdata/downloadp/";
    var req = $.ajax(url + pid + "/" + s + "/", {
        type: 'GET',
        dataType: 'jsonp',
        scriptCharset: "utf-8",
        cache: false,
        success: function (data, textStatus, XMLHttpRequest) { succeed(data, textStatus, XMLHttpRequest); },
        timeout: g_timeout,
        error: function (XMLHttpRequest, textStatus, thrownError) { fail(XMLHttpRequest, textStatus, thrownError); }
    });
}
