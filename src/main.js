import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx'; // GPX plugin

document.querySelector('#app').innerHTML = `
  <h1>GPX Viewer</h1>
  <input type="file" id="gpxInput" accept=".gpx" />
  <div id="map" style="height: 500px;"></div>
`;

const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// GPX file input logic
document.getElementById('gpxInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const gpxData = event.target.result;

    // Parse and display GPX
    const gpx = new L.GPX(gpxData, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null,
      },
    }).on('loaded', function (e) {
      map.fitBounds(e.target.getBounds());
    }).addTo(map);
  };

  reader.readAsText(file);
});
