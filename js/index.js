
var channel;

$(document).ready(function(){

	// init connection
	var IFRAME_DOMAIN = "http://www.paikkatietoikkuna.fi";
	var iFrame = document.getElementById('oskari');
	channel = OskariRPC.connect(
	    iFrame,
	    IFRAME_DOMAIN
	);
	channel.onReady(function() {
	    //channel is now ready and listening.
	    channel.log('Map is now listening');
	    var expectedOskariVersion = '1.35.0';
	    channel.isSupported(expectedOskariVersion, function(blnSupported) {
	        if(blnSupported) {
	            channel.log('Client is supported and Oskari version is ' + expectedOskariVersion);
	        } else {
	            channel.log('Oskari-instance is not the one we expect (' + expectedOskariVersion + ') or client not supported');
	            // getInfo can be used to get the current Oskari version
	            channel.getInfo(function(oskariInfo) {
	                channel.log('Current Oskari-instance reports version as: ', oskariInfo);
	            });
	        }
	    });
	    channel.isSupported(function(blnSupported) {
	        if(!blnSupported) {
	            channel.log('Oskari reported client version (' + OskariRPC.VERSION + ') is not supported.' +
	            'The client might work, but some features are not compatible.');
	        } else {
	            channel.log('Client is supported by Oskari.');
	        }
	    });

	    drawGeoJSON(channel);
        addFeatureListener(channel);
	});
});