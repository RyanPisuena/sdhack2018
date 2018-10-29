let app_id = '';
let app_code = '';
let centerLat = 37.7993;
let centerLng = -122.3977;
let userInput = '37.7993,-122.3977,150';


var platform = new H.service.Platform({
  'app_id': app_id,
  'app_code': app_code
});

var targetElement = document.getElementById("containerOfOurMap");
var defaultLayers = platform.createDefaultLayers();


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

// Change unit system to imperial
ui.setUnitSystem(H.ui.UnitSystem.IMPERIAL);

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

  /////////////////////////////////////////////////////////////////////////////////////
  console.log(markerData.getCell('POSTAL_CODE'), markerData.getCell('ISO_COUNTRY_CODE'))
});
// Create the parameters for the routing request:
var routingParameters = {
  // The routing mode:
  'mode': 'fastest;car',
  // The start point of the route:
  'waypoint0': 'geo!37.7993,-122.3977',
  // The end point of the route:
  'waypoint1': 'geo!37.793732,-122.404182',
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  'representation': 'display'
};

var homeParameters = {
  // The routing mode:
  'mode': 'fastest;car',
  // The start point of the route:
  'waypoint0': 'geo!37.793732,-122.404182',
  // The end point of the route:
  'waypoint1': 'geo!37.793740,-122.404210',
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  'representation': 'display'
};

// Define a callback function to process the routing response:
var onResult = function(result) {
   console.log(result);
  var route,
    routeShape,
    startPoint,
    endPoint,
    linestring;
  if(result.response.route) {
  // Pick the first route from the response:
  route = result.response.route[0];
  // Pick the route's shape:
  routeShape = route.shape;

  // Create a linestring to use as a point source for the route line
  linestring = new H.geo.LineString();

  // Push all the points in the shape into the linestring:
  routeShape.forEach(function(point) {
    var parts = point.split(',');
    linestring.pushLatLngAlt(parts[0], parts[1]);
  });

  // Retrieve the mapped positions of the requested waypoints:
  startPoint = route.waypoint[0].mappedPosition;
  //endPoint = route.waypoint[1].mappedPosition;

  // Create a polyline to display the route:
  var routeLine = new H.map.Polyline(linestring, {
    style: { strokeColor: 'blue', lineWidth: 10 }
  });

  // Create a marker for the start point:
  var startMarker = new H.map.Marker({
    lat: startPoint.latitude,
    lng: startPoint.longitude
  });


  // Add the route polyline and the two markers to the map:
  map.addObjects([routeLine, startMarker]);

  // Set the map's viewport to make the whole route visible:
  map.setViewBounds(routeLine.getBounds());
  }
};

// Get an instance of the routing service:
var router = platform.getRoutingService();

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):


var routingBlue = function() {
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });
}

var routingHome = function() {
  router.calculateRoute(homeParameters, onResult,
    function(error) {
      alert(error.message);
    });
}

origin(map);
//map.addLayer(centroids);
map.addLayer(defaultLayers.incidents);
map.addLayer(boundaries);


/////////////////////////////////////////////////////////////

function loadData(array) {
  for (var item in array) {
    meters = array[item]['distance'];
    array[item]['distance'] = Math.round(meters*0.000621371*100)/100;
  }

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
      // sorts search results by descending rating,
      // then by alphabetical order
      customRanking: [
        'desc(averageRating)',
        'asc(title)'
      ]
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
      // sorts search results by ascending distance,
      // then by alphabetical order
      customRanking: [
        'asc(distance)',
        'asc(title)'
      ]
    },
    function(err, content)
    {
      if (err) throw err;
    }
  )
}
