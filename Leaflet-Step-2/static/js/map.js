//earthquake data
url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url).then(function(response){
    console.log(response.features[0])
    console.log(response.features[0].geometry)

    narrowed_response = response.features
    
    magnitudes = []
    depths = []
    coordinates = []
    place = []


    for (var i=0; i<narrowed_response.length; i++){

      if (narrowed_response){
        coordinates.push([narrowed_response[i].geometry.coordinates[1], narrowed_response[i].geometry.coordinates[0]]);
        depths.push(narrowed_response[i].geometry.coordinates[2])
        magnitudes.push(narrowed_response[i].properties.mag)
        place.push(narrowed_response[i].properties.place)
    }
    }

    //checking lengths of lists
    console.log(coordinates.length)
    console.log(depths.length)
    console.log(magnitudes.length)
    console.log(place.length)
    // console.log(magnitudes)
    // console.log(place)

    return coordinates
    return depths
    return place
    return magnitudes

  function getColor(depth){
    if (depth < 10) {
      color = 'green'
    }
    else if (depth < 30){
      color = 'lime'
    }
    else if (depth < 50){
      color = 'yellow'
    }
    else if (depth < 70){
      color = 'gold'
    }
    else if (depth < 90){
      color = 'orange'
    }
    else {
      color = 'red'
    }

    return color
  }
});

//techtonic plates data
var plates_url = './data/plates.json'

// Perform a GET request to the query URL
d3.json(plates_url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    for (var i = 0; i < coordinates.length; i++) {

        // console.log(coordinates[i])
        circle = L.circleMarker(coordinates[i], {
          fillOpacity: 1,
          color: 'black',
          fillColor: getColor(depths[i]),
          radius: 7*magnitudes[i]
        }).bindPopup("<h2>" + place[i]+ "</h2> <hr> <h3>Magnitude: " + magnitudes[i] + "</h3>" + "<hr> <h3>Depth: " + depths[i]+"</h3>")

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}}