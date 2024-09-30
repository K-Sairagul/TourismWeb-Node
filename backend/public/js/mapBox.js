/* eslint-disable */
export const Map=locations=>{

  mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFndWwiLCJhIjoiY20xaHIxdmEwMGZsODJpczhzNHQyczBhdyJ9._jU_4PB4VJiQRzBYEZrAyg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/sairagul/cm1i159b300b701qtgepk223k',
  scrollZoom:false
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(loc.coordinates)
    .addTo(map);

  // Adding popup
  new mapboxgl.Popup({
    offset:30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`)
    .addTo(map)
  

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds,{
  padding:{
      top:200,
      bottom:150,
      left:100,
      right:100
  }
});


}

