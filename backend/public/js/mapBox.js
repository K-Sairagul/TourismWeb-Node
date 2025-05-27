/* eslint-disable */
export const Map = (locations) => {
  // 1. Set Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFndWwiLCJhIjoiY20xaHIxdmEwMGZsODJpczhzNHQyczBhdyJ9._jU_4PB4VJiQRzBYEZrAyg';

  // 2. Initialize the map with error handling
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sairagul/cm1i159b300b701qtgepk223k', // Verify this style exists!
    scrollZoom: false,
  });

  // 3. Handle map loading errors
  map.on('error', (e) => {
    console.error('Mapbox Error:', e.error);
    // Fallback to a default style if custom style fails
    map.setStyle('mapbox://styles/mapbox/streets-v11')
      .catch(err => console.error('Failed to load fallback style:', err));
  });

  // 4. Fit bounds to locations
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`)
      .addTo(map);

    // Extend bounds
    bounds.extend(loc.coordinates);
  });

  // 5. Adjust map view to fit markers
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};