var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
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


    for (var i=0; i<narrowed_response.length; i++){

      if (narrowed_response){
        coordinates.push([narrowed_response[i].geometry.coordinates[0], narrowed_response[i].geometry.coordinates[1]]);
        depths.push(narrowed_response[i].geometry.coordinates[2])
        magnitudes.push(narrowed_response[i].properties.mag)
    }
    }

    console.log(coordinates.length)
    console.log(depths.length)
    console.log(magnitudes.length)




    // Define a markerSize function that will give each city a different radius based on its population
// function markerSize(population) {
//   return population / 40;
// }
})