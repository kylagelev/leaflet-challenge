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

  

    for (var i = 0; i < coordinates.length; i++) {

      if (depths[i] < 10) {
        color = 'green'
      }
      else if (depths[i] < 30){
        color = 'lime'
      }
      else if (depths[i] < 50){
        color = 'yellow'
      }
      else if (depths[i] < 70){
        color = 'gold'
      }
      else if (depths[i] < 90){
        color = 'orange'
      }
      else {
        color = 'red'
      }




      // console.log(coordinates[i])
      circle = L.circleMarker(coordinates[i], {
        fillOpacity: 1,
        color: 'black',
        fillColor: color,
        radius: 5*magnitudes[i]
      }).bindPopup("<h2>" + place[i]+ "</h2> <hr> <h3>Magnitude: " + magnitudes[i] + "</h3>" + "<hr> <h3>Depth: " + depths[i]+"</h3>").addTo(myMap);


}
})