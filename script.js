
var platform = new H.service.Platform({
  'app_id': '5FP2Mb897kNdkg0oU5lG',
  'app_code': 'ych9vG1PjklksZ5TFN2HNA'
});

var targetElement = document.getElementById("containerOfOurMap");

// Instantiate a map inside the DOM element with id map. The
// map center is in San Francisco, the zoom level is 10:
var map = new H.Map(document.getElementById('containerOfOurMap'),
  platform.createDefaultLayers().normal.map, {
  center: {lat: 37.7942, lng: -122.4070},
  zoom: 15
  });

// Create a group object to hold map markers:
var group = new H.map.Group();

// Create the default UI components:
var ui = H.ui.UI.createDefault(map, platform.createDefaultLayers());

// Add the group object to the map:
map.addObject(group);

// Obtain a Search object through which to submit search
// requests:
var search = new H.places.Search(platform.getPlacesService()),
  searchResult, error;

// Define search parameters:
var params = {
// Plain text search for places with the word "hotel"
// associated with them:
  'q': 'car repair',
//  Search in the Chinatown district in San Francisco:
  'at': '37.7942,-122.4070'
};


// Define a callback function to handle data on success:
function onResult(data) {
  addPlacesToMap(data.results);
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
    lng: place.position[1]}, {icon: icon})
  return marker;
  }));
}

// Run a search request with parameters, headers (empty), and
// callback functions:
search.request(params, {}, onResult, onError);







/************************************************************/
function populateDiv() {
var para = document.createElement("p");
var node = document.createTextNode("Random Car Repair");
para.appendChild(node);
var para2 = document.createElement("p");
var node2 = document.createTextNode("760-453-5965");
para2.appenChild(node2);

var populate = document.getElementById("businessInfo");
populate.appendChild(para);
populate.appendChild(para2);
}





/************************************************************/
