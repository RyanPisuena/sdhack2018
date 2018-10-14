let app_id = '5FP2Mb897kNdkg0oU5lG';
let app_code = 'ych9vG1PjklksZ5TFN2HNA';
let centerLat = 37.7993;
let centerLng = -122.3977;
let userInput = '37.7993,-122.3977,150';

var platform = new H.service.Platform({
  'app_id': app_id,
  'app_code': app_code
});

var targetElement = document.getElementById("containerOfOurMap");

// Instantiate a map inside the DOM element with id map. The
// map center is in San Francisco, the zoom level is 10:
var map = new H.Map(document.getElementById('containerOfOurMap'),
  platform.createDefaultLayers().normal.map, {
  center: {lat: 37.7942, lng: -122.4070},
  zoom: 15
  });

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create a group object to hold map markers:
var group = new H.map.Group();

// Create the default UI components:
var ui = H.ui.UI.createDefault(map, platform.createDefaultLayers());

// Add the group object to the map:
map.addObject(group);

// Obtain a Search object through which to submit search
// requests:
var search = new H.places.Search(platform.getPlacesService()), searchResult, error;

// Define search parameters:
var params = {
// Plain text search for places with the word "hotel"
// associated with them:
  'q': 'car repair',
//  Search in the Chinatown district in San Francisco:
  'at': '37.7942,-122.4070'
};

var result;
// Define a callback function to handle data on success:
function onResult(data) {
  searchResult=data;
  result=data;
  addPlacesToMap(data.results);
  console.log(data.results);
  loadData(data.results.items);
}

// Define a callback function to handle errors:
function onError(data) {
  error = data;
}

// This function adds markers to the map, indicating each of
// the located places:
function addPlacesToMap(result) {

  /***************************************************/
  var markerIcon = '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<g><rect stroke="white" fill="#009655" x="1" y="1" width="22" ' +
  'height="22" /><rect class="btn" x="0" y="0" width="10" height="10" onclick="populateDiv()" /></g></svg>';

  /***************************************************/
var icon = new H.map.DomIcon(markerIcon);
  group.addObjects(result.items.map(function (place) {
  var marker = new H.map.DomMarker({lat: place.position[0],
    lng: place.position[1]}, {icon: icon});
    // add 'tap' event listener, that opens info bubble, to the group

/*    if(result) {
      // let counter = result.results.items.length;
      // JSON.parse(counter);
    //  for (var i = 0; i < counter; i++) {
    group.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains

      var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
        // read custom data
        content: result.items[0].title + "\n " +
                 result.items[0].vicinity// line for displaying data
      });
      // show info bubble
      ui.addBubble(bubble);
    }, false);
//}
} */
  return marker;
  }));
}

// Run a search request with parameters, headers (empty), and
// callback functions:
search.request(params, {}, onResult, onError);

//////////////////////////////////////////////////////////////////

// Create the parameters for the reverse geocoding request:
var reverseGeocodingParameters = {
    prox: userInput,
    mode: 'retrieveAddresses',
    maxresults: 12
  };

// Define a callback function to process the response:
function onSuccess(result) {
  var locatio = result.Response.View[0].Result[0];
  console.log(result.Response.View[0].Result[0]);
  console.log("success");

  // Create an InfoBubble at the returned location with
  // the address as its contents:
  ui.addBubble(new H.ui.InfoBubble({
    lat: locatio.Location.DisplayPosition.Latitude,
    lng: locatio.Location.DisplayPosition.Longitude
   }, { content: locatio.Location.Address.Label }));
};

function onFailure(result) {
  console.log("Failure");
}
// Get an instance of the geocoding service:
var geocoder = platform.getGeocodingService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
geocoder.reverseGeocode(
  reverseGeocodingParameters,
  onSuccess,
  onFailure);

/////////////////////////////////////////////////////////////

function origin(map){
  map.setCenter({lat:centerLat, lng: centerLng});
  map.setZoom(14);

  var centerLocation = new H.map.Marker({lat:centerLat, lng:centerLng});
  map.addObject(centerLocation);

  centerLocation.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains

    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
      // read custom data
      content: 'Broken car at ' + '\n'
    });
    // show info bubble
    ui.addBubble(bubble);
})
};

var service = platform.getPlatformDataService();

style = new mapsjs.map.SpatialStyle();
// create tile provider and layer that displays postcode boundaries
var boundariesProvider = new mapsjs.service.extension.platformData.TileProvider(service,
{
  layer: 'PSTLCB_GEN', level: 12
}, {
  resultType: mapsjs.service.extension.platformData.TileProvider.ResultType.POLYLINE,
  styleCallback: function(data) {return style}
});
var boundaries = new mapsjs.map.layer.TileLayer(boundariesProvider);

// create tile provider and layer that displays postcode area centroids
var centroidsProvider = new mapsjs.service.extension.platformData.TileProvider(service,
{
  layer: 'PSTLCB_MP', level: 12
}, {
  resultType: mapsjs.service.extension.platformData.TileProvider.ResultType.MARKER
});

// add events listener, that outputs data provided by the Platform Data Extenstion and
// associated with the H.map.Marker
centroidsProvider.addEventListener('tap', function(ev) {
  var markerData = ev.target.getData();
  console.log(markerData.getCell('POSTAL_CODE'), markerData.getCell('ISO_COUNTRY_CODE'))
});

origin(map);
map.addLayer(centroids);
map.addLayer(defaultLayers.incidents);
map.addLayer(boundaries);

/////////////////////////////////////////////////////////////

function loadData(array) {
  // retrieve Algolia data index
  var client = algoliasearch('W1MOOQ9FQ0', '432c1c13ad28182cfcf79629cfbfe942');
  var index = client.initIndex('shops_index');

  // replace existing data
  index.clearIndex(function(err, content) {
    if (err) throw err;
  });
  const records = array;
  index.addObjects(records);

  // set sort settings for main index
  index.setSettings(
    {
      searchableAttributes: [
        'title',
        'vicinity'
      ],
      customRanking: ['desc(averageRating)']
    },
    function(err, content)
    {
      if (err) throw err;
    }
  );

  // create and set sort settings for replica
  index.setSettings(
    {
      replicas: [
        'shops_index_by_distance'
      ]
    }
  )
  var replica = client.initIndex('shops_index_by_distance');
  replica.setSettings(
    {
      searchableAttributes: [
        'title',
        'vicinity'
      ],
      customRanking: ['asc(distance)']
    },
    function(err, content)
    {
      if (err) throw err;
    }
  )
}
