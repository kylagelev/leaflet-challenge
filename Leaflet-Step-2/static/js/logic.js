var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


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

    for (var i = 0; i < coordinates.length; i++) {

      // console.log(coordinates[i])
      circle = L.circleMarker(coordinates[i], {
        fillOpacity: 1,
        color: 'black',
        fillColor: getColor(depths[i]),
        radius: 7*magnitudes[i]
      }).bindPopup("<h2>" + place[i]+ "</h2> <hr> <h3>Magnitude: " + magnitudes[i] + "</h3>" + "<hr> <h3>Depth: " + depths[i]+"</h3>").addTo(myMap);
  
      //adding light layer
      var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      });

      //adding dark layer
      var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
      });

      var baseMaps = {
        Light: light,
        Dark: dark,
        Satellite: satellite
      };

      var overlayMaps = {
        Earthquakes: circle,
        // Faults:
      }



    //setting up legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    depths = [-10, 10, 30, 50, 70, 90],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
    };
  }
  L.control.layers(baseMaps).addTo(myMap);


legend.addTo(myMap);
});

