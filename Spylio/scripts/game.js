// game.js

var startlat = 0.0;
var startlon = 0.0;
var token = "";

var dataurl = "http://gpspy.eu1.frbit.net/";
var g_timeout = 5000;

//$(document).ready(startup());

function startRegister() {
    if (checkForGeolocate()) {
        register($('#phone').val(), $('#name').val(), function (result) {
        });
        setInterval(function () { getLocation(); }, 3000);
    }
}

function register(phonenumber, name, callback) {
    var data = "register/?phone=" + phonenumber + "&name=" + name;

    getData(data, registerOK, registerFail, callback);
}

function registerOK(data, textStatus, XMLHttpRequest, callback) {
    var result = false;
    if (data != null) {
        var res = data;
        var temp = res.token;
        if (temp != null) {
            token = temp;
            result = true;
        }        
    }
    callback(result);
}

function registerFail(XMLHttpRequest, textStatus, thrownError, callback) {
    callback(false);
}

function updateLocation(lat, lon, callback) {
    var data = "locate/?token=" + token + "&lat=" + lat + "&lon=" + lon;

    getData(data, locationOK, locationFail, callback);
}

function locationOK(data, textStatus, XMLHttpRequest, callback) {
    var result = false;
    if (data != null) {
        var res = data;
        var temp = res.hotness;
        if (temp != null) {
            result = true;
            $("#temperature").html("Hotness: " + temp);
        }
    }
    callback(result);
}

function locationFail(XMLHttpRequest, textStatus, thrownError, callback) {
    callback(false);
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
    updateLocation(position.coords.latitude, position.coords.longitude, function (result) {
    });
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

function getData(s, succeed, fail, callback) {
    var url = dataurl + s;
    url = encodeURI(url)
    var req = $.ajax(url, {
        type: 'GET',
        dataType: 'jsonp',
        scriptCharset: "utf-8",
        cache: false,
        success: function (data, textStatus, XMLHttpRequest) {
            succeed(data, textStatus, XMLHttpRequest, callback);
        },
        timeout: g_timeout,
        error: function (XMLHttpRequest, textStatus, thrownError) {
            fail(XMLHttpRequest, textStatus, thrownError, callback);
        }
    });
}
