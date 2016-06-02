function addFeatureListener(channel) {
    channel.handleEvent(
        'FeatureEvent',
        function(data) {
            console.log(
                data
            );

            if(data.operation==='click') {
                channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest',[{layer:[data.features[0].layerId]}, {id: [data.features[0].id]}]);
            }
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );
}