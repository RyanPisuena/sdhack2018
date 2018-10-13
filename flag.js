/*******************************************************************/


Im not sure when you are using api.here.com. Maybe you can use google.maps.Geocoder like i did below. This will set lat and lng equal to your position, if its turns on in your browser of cause.

libary:

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
Js:

var geocoder;
    geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
    //Get the latitude and the longitude;
    function successFunction(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        codeLatLng(lat, lng)
    }
    function errorFunction() {
        alert("Geocoder failed");
    }
    function codeLatLng(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results)
                if (results[1]) {
                    alert("Found you! at Latitude: " +lat + " and Longitude: " +lng);
                } else {
                    alert("No results found");
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }




/*******************************************************************/



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

    if(result) {
      // let counter = result.results.items.length;
      // JSON.parse(counter);
    //  for (var i = 0; i < counter; i++) {
    group.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains

      var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
        // read custom data
        content: result.items[i].title + " \n" +
                            result.items[i].vicinity;
      });


      // show info bubble
      ui.addBubble(bubble);
    }, false);
}
  return marker;
  }));
}

// Run a search request with parameters, headers (empty), and
// callback functions:
search.request(params, {}, onResult, onError);
console.log(platform.getPlacesService());


/****************************** ******************************/
function populateDiv() {
var para = document.createElement("p");
var node = document.createTextNode("Random Car Repair");
para.appendChild(node);
var para2 = document.createElement("p");
var node2 = document.createTextNode("760-453-5965");
para2.appendChild(node2);

var populate = document.getElementById("businessInfo");
populate.appendChild(para);
populate.appendChild(para2);
}

/************************************************************/
