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
	return converted;
}

function resolveRouteA() {
	return resolveRoute('geojson_wgs84/routeA.json');
}

function resolveRouteB() {
	return resolveRoute('geojson_wgs84/routeB.json');
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
            centerTo: true,
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

}


function drawGeoJSON(channel) {

	drawRoute(channel, resolveRouteA(), 'rgba(142,196,73,1)', 12, 2);
	drawRoute(channel, resolveRouteB(), '#0E683B', 5, 1);
/*
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
*/
	//DRINK
	drawMarker(
		channel, 'drink_layer',
    6684028.595, 383911.772,
		0, 20, 6, 3,
		imgDrink
		);
	drawMarker(
		channel, 'drink_layer',
    6683384.953, 385233.720,
		0, 20, 6, 3,
		imgDrink
		);

	//16km
	drawMarker(
		channel, 'route_layer',
		6682943.473, 384601.671,
		0, 50, 5, 4,
		imgRouteB
		);

	//8km
	drawMarker(
		channel, 'route_layer',
		6682587.473, 384601.671,
		0, 50, 5, 4,
		imgRouteA
		);

	//FINISH
	drawMarker(
		channel, 'startfinish_layer',
		6681671.579, 384735.477, 
		0, 2000, 4, 7,
		imgFinish
		);

	//START
	drawMarker(
		channel, 'startfinish_layer',
		6681681.946, 384813.064, 
		0, 2000, 3, 7,
		imgStart);

}