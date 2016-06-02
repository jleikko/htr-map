function convertWGS84toETRSTM35FIN(lat, lon) {
	var wgsProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
	var finnProjection = "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs";
	return proj4(wgsProjection,finnProjection,[lat,lon]);
}

function resolveRoute(fileUrl) {
	$.ajaxSetup( { "async": false } );
	var route = $.getJSON(fileUrl).responseJSON;
	var convertedCoordinates =
		route.features[0].geometry.coordinates.map(function(point) {
			var lat = point[0];
			var lon = point[1];
			var converted = convertWGS84toETRSTM35FIN(lat, lon);
			return [converted[0], converted[1]];
		});
	var converted = {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3067'
            }
          },
          'features': [
        	{
            	"type": "Feature",
            	"geometry": {
	                "type": "LineString",
                	"coordinates": convertedCoordinates
                }
            }]
        };
    console.log(converted);
	return converted;
}

function resolveRoute10() {
	return resolveRoute('geojson_wgs84/route10.json');
}

function resolveRoute21() {
	return resolveRoute('geojson_wgs84/route21.json');
}

function drawMarker(channel, layerId, n, e, minReso, maxReso, prio, size, svg) {

        var geojsonObject = {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3067'
            }
          },
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [e, n]
              },
              'properties': {
                'test_property': svg
              }

            }

          ]
        };

    var options = {
        'minResolution': minReso,
        'maxResolution': maxReso
    };
    var params = [geojsonObject, {
    		layerId: layerId,
            clearPrevious: false,
            layerOptions: options,
            centerTo: false,
            featureStyle: {
				image : {
					shape: {
						data: svg,
						x: 16,
						y: 16
					},
					size: size
				},
            prio: prio,
            minScale: 1451336
        }}];

    channel.postRequest(
        'MapModulePlugin.AddFeaturesToMapRequest',
        params
    );
    channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params);

}

function drawRoute(channel, route, color, stroke, prio) {
    var options = {
        'minResolution': 0,
        'maxResolution': 2000
    };
    var params = [route, {
    		layerId: 'routes',
            clearPrevious: false,
            layerOptions: options,
            centerTo: false,
            featureStyle: {
                stroke : {
                    color: color,
                    width: stroke
                }
            },
            prio: prio
        }];

    channel.postRequest(
        'MapModulePlugin.AddFeaturesToMapRequest',
        params
    );
    channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params);

}


function drawGeoJSON(channel) {

	drawRoute(channel, resolveRoute10(), 'rgba(142,196,73,1)', 12, 2);
	drawRoute(channel, resolveRoute21(), '#0E683B', 5, 1);

	//ARROW 1
		drawMarker(
		channel, 'drink_layer',
		6682033, 384105,
		0, 20, 7, 10,
		imgArr1
		);

	//ARROW 2
		drawMarker(
		channel, 'drink_layer',
		6680800, 384338,
		0, 20, 7, 10,
		imgArr2
		);

	//DRINK
	drawMarker(
		channel, 'drink_layer',
		6683247.000, 384020.000,
		0, 20, 6, 3,
		imgDrink
		);
	drawMarker(
		channel, 'drink_layer',
		6681437.000, 384287.000,
		0, 20, 6, 3,
		imgDrink
		);

	//21km
	drawMarker(
		channel, 'route_layer',
		6682725.000, 384176.000,
		0, 50, 5, 4,
		img21
		);

	//10km
	drawMarker(
		channel, 'route_layer',
		6680605.000, 384156.000,
		0, 50, 5, 4,
		img10
		);

	//FINISH
	drawMarker(
		channel, 'startfinish_layer',
		6674115.000, 384775.000,
		0, 2000, 4, 7,
		imgFinish
		);

	//START
	drawMarker(
		channel, 'startfinish_layer',
		6681698.000, 384683.000, 
		0, 2000, 3, 7,
		imgStart);

	channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest',[])

}