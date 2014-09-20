// game.js

var startlat = 0.0;
var startlon = 0.0;

$(document).ready(startup());

function startup() {
    if (checkForGeolocate()) {
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
}