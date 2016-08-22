#!/usr/bin/env node

// var simplify = require('./')
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var concat = require('concat-stream')
var path = require('path')
var usage = fs.readFileSync(path.join(__dirname, 'gdalinfotogeojson-usage.txt'), { encoding: 'utf8' })
var stdin

var tolerance = argv.t || argv.tolerance || 0.001
tolerance = +tolerance // cast to Number

if (argv.help || argv.h) {
  console.log(usage)
  process.exit()
}

if (argv._[0] && argv._[0] !== '-') {
  stdin = fs.createReadStream(argv._[0])
} else if (!process.stdin.isTTY || argv._[0] === '-') {
  stdin = process.stdin
} else {
  console.log(usage)
  process.exit(1)
}

// buffer all input TODO streaming simplification
stdin.pipe(concat(function (buffer) {
  try {
    var geojson = JSON.parse(buffer)
    // console.log(geojson);
  } catch (e) {
    return console.error(e)
  }
  var features = [];


  var data = {"type":"FeatureCollection","features":[]};

  var bounds = geojson.wgs84Extent.coordinates[0];
  // console.log(bounds);
  /*
    wgs84Extent [0] =
    {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -111.760392, 35.2570219
          ],
          [
            -111.760263, 35.1086168
          ],
          [
            -111.6146556, 35.2570339
          ],
          [
            -111.6147912, 35.1086258
          ],
          [
            -111.760392, 35.2570219
          ]
        ]
      ]
    }
  */

  var w = geojson.wgs84Extent.coordinates[0][0][0];
  var s = geojson.wgs84Extent.coordinates[0][1][1];
  var e = geojson.wgs84Extent.coordinates[0][2][0];
  var n = geojson.wgs84Extent.coordinates[0][0][1];

  var feature = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[]]}};

  feature.geometry.coordinates[0].push([ w,s ]);
  feature.geometry.coordinates[0].push([ e,s ]);
  feature.geometry.coordinates[0].push([ e,n ]);
  feature.geometry.coordinates[0].push([ w,n ]);
  feature.geometry.coordinates[0].push([ w,s ]);
  features.push(feature);




  // center point
  feature = {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[] }};
  feature.geometry.coordinates = [ (w+e)/2, (n+s)/2 ];
  features.push(feature);

  data.features = features;
  console.log(JSON.stringify(data))
}))
