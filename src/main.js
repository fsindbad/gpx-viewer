import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';

document.querySelector('#app').innerHTML = `
  <h1>GPX Viewer</h1>
  <input type="file" id="gpxInput" accept=".gpx" />
  <div id="map" style="height: 500px; margin-top: 10px;"></div>
`;

const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// === GPX from local upload ===
document.getElementById('gpxInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const gpxData = event.target.result;
    loadGpxFromString(gpxData);
  };
  reader.readAsText(file);
});

// === GPX from URL ===
function loadGpxFromUrl(url) {
  new L.GPX(url, {
    async: true,
    marker_options: {
      startIconUrl: null,
      endIconUrl: null,
      shadowUrl: null,
    },
  }).on('loaded', function (e) {
    map.fitBounds(e.target.getBounds());
  }).addTo(map);
}

// === GPX from String (for FileReader) ===
function loadGpxFromString(xmlText) {
  new L.GPX(xmlText, {
    async: true,
    marker_options: {
      startIconUrl: null,
      endIconUrl: null,
      shadowUrl: null,
    },
  }).on('loaded', function (e) {
    map.fitBounds(e.target.getBounds());
  }).addTo(map);
}

// Auto-load example GPX
loadGpxFromUrl('tracks/monalisa_rappi_yacht_club.gpx');
