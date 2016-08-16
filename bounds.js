#!/usr/bin/env node

// var simplify = require('./')
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var concat = require('concat-stream')
var path = require('path')
var usage = fs.readFileSync(path.join(__dirname, 'bounds-usage.txt'), { encoding: 'utf8' })
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

  var bounds = geojson.bounds.split(',');  // west, south, east, north
  // console.log(bounds);
  var w = parseFloat(bounds[0]);
  var s = parseFloat(bounds[1]);
  var e = parseFloat(bounds[2]);
  var n = parseFloat(bounds[3]);

  var feature = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[]]}};

  feature.geometry.coordinates[0].push([ w,s ]);
  feature.geometry.coordinates[0].push([ e,s ]);
  feature.geometry.coordinates[0].push([ e,n ]);
  feature.geometry.coordinates[0].push([ w,n ]);
  feature.geometry.coordinates[0].push([ w,s ]);
  features.push(feature);




  // center point
  feature = {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[] }};
  feature.properties = geojson;
  feature.geometry.coordinates = [ (w+e)/2, (n+s)/2 ];
  features.push(feature);

  data.features = features;
  console.log(JSON.stringify(data))
}))
