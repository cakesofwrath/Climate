'use strict';
/*
*/
var fs = require('fs');

var schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
//console.log(data.temperature_anomaly.length);
//console.log(data.latitude.length * data.longitude.length * data.time.length);
//Apparently: time, then long, then lat.
//console.log(schema.time.length/12, data.time.length/12); //165 years, 0 months
//console.log(schema.time.length%12, data.time.length%12);

var geoJSONs = [];

var dataIndex = 0;
var t = 0, lat = 0, long = 0;
var d = 2.5;

function saveAll(gJsons) {
    if(gJsons.length > 10){
        console.error("Error: too many geoJSONs");
        return;
    }
    var yr = 1850;
    for(var gJ in gJsons) {
        var fileName = 'geoJSON/HadCRUT_' + yr + '.json'
        fs.writeFile(fileName, JSON.stringify(gJsons[gJ]), function(err) {
            if(err) throw err;
            console.log(fileName + ' saved.');
        });
        yr += 25;        
    }
}

//Averages temp anomaly over a year, given an index 
var avg_t_a = function(index) { 
    var vals = [];
    for(var i=index; i<index+12; i++) {
        vals.push(parseInt(data.temperature_anomaly[i]));
    }
    return vals.reduce(function(a, b) { //should automatically return NaN if missing data.
        return a + b;
    }) / 12;
};

/*
==============================================================================================================
==============================================================================================================
==============================================================================================================
*/

while(t < schema.time.length) { //The degrees north
    var geoJSON = {
                    'type': 'FeatureCollection',
                    'features': []
                };
    while(lat < schema.latitude.length) { //The degrees east.
        while(long < schema.longitude.length) { //days since 1850-1-1 00:00:00, continues until 2014
            geoJSON.features.push({
               'type': 'Feature',
               'geometry': {
                   'type': 'Polygon',
                   'coordinates': [
                        [
                            [parseInt(data.longitude[long])+d, parseInt(data.latitude[lat])+d],
                            [parseInt(data.longitude[long])+d, parseInt(data.latitude[lat])-d],
                            [parseInt(data.longitude[long])-d, parseInt(data.latitude[lat])-d],
                            [parseInt(data.longitude[long])-d, parseInt(data.latitude[lat])+d],
                            [parseInt(data.longitude[long])+d, parseInt(data.latitude[lat])+d]
                        ]
                    ]
               },
               'properties': {
                   'temperature_anomaly': avg_t_a(dataIndex)
               }
            });
            
            long++;
            dataIndex++;
        }
        lat++;
    }
    t += (12 * 25);
    geoJSONs.push(geoJSON);
}

saveAll(geoJSONs);
