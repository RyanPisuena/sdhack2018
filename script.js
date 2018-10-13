// app_id = 5FP2Mb897kNdkg0oU5lG
// app_code = ych9vG1PjklksZ5TFN2HNA
/*
var platform = new H.service.Platform({
  'app_id': '{YOUR_APP_ID}',
  'app_code': '{YOUR_APP_CODE}'
});
*/

var platform = new H.service.Platform({
  'app_id': '5FP2Mb897kNdkg0oU5lG',
  'app_code': 'ych9vG1PjklksZ5TFN2HNA'
});

var targetElement = document.getElementById("containerOfOurMap");

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('containerOfOurMap'),
  defaultLayers.normal.map,
  {
    zoom: 15,
    center: { lat: 32.8853304, lng: -117.23951698320596}
  });

map.addLayer(defaultLayers.venues);
map.addLayer(defaultLayers.incidents);

// Define a variable holding SVG mark-up that defines an icon image:
var svgMarkup = '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
  'height="22" /><text x="12" y="18" font-size="12pt" ' +
  'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
  'fill="white">H</text></svg>';

// Create an icon, an object holding the latitude and longitude, and a marker:
var icon = new H.map.Icon(svgMarkup),
  coords = {lat: 32.8853304, lng: -117.23951698320596},
  marker = new H.map.Marker(coords, {icon: icon});

// Add the marker to the map and center the map at the location of the marker:
map.addObject(marker);
map.setCenter(coords);
