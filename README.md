
# JSON to GeoJson.

This converts a certain form of JSON
to
[GeoJSON](http://www.geojson.org/), with [nodejs](http://nodejs.org/).

* the original data structure is preserved as the properties in GeoJson.


## Using it as a console utility

* Install [Node.js](https://nodejs.org/en/download/)
* Node.js makes use of `npm`, which should be part of the install
* download dependencies with `npm install`.



* Run this to test
```js
> ./cli.js test/results.json > test/results.geojson
```

-----

![GIF demo](cli.gif)

-----

This is the certain form of JSON

```js
{ "results": [
        {
        "data": 17,
        "data1": "2006-04-23T19:32:42.469Z",
        "data2": 2.253802555866411,
        "latitude": 1.2,
        "longitude": 2.3,
        "data3": 16.2,
        "data4": "some-data",
        "data5": "2004-04-23T19:32:42.469Z",
        "data6": 20
    }
  ]
}

```

Which generates the following GeoJSON
```js
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "data": 17,
        "data1": "2006-04-23T19:32:42.469Z",
        "data2": 2.253802555866411,
        "latitude": 1.2,
        "longitude": 2.3,
        "data3": 16.2,
        "data4": "some-data",
        "data5": "2004-04-23T19:32:42.469Z",
        "data6": 20
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.3,
          1.2
        ]
      }
    }
  ]
}
```
