'use strict';
/*
*/
var fs = require('fs');

var schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
//console.log(data.temperature_anomaly.length);
//console.log(data.latitude.length * data.longitude.length * data.time.length);
//Apparently: time, then long, then lat.

/*for(var lat in schema.latitude) { //The degrees north
    for(var long in schema.longitude) { //The degrees east.
        for(var t in schema.time) { //days since 1850-1-1 00:00:00, continues until 2014
            //a temperature_anomaly in deg K.
            
        }
    }
}*/

for(var t in schema.time) {
    for(var lat in schema.latitude) {
        for(var long in schema.longitude) {
            
        }
    }
}
//algorithm for converting days since  1850-1-1 00:00:00 to actual time.
var convertTime = function(days) {
    var numYears =  Math.floor(days/365);
    var numMonths = Math.floor((days - numYears * 365)/12);
   // var numDays = Math.floor((days - numYears * 365 - numMonths * ))
    
    //var year = 1850 +;
    var month = 1; //stack overflow this shiz.Should probably account for leap years.
    var day = 1;
    return 0;
};
