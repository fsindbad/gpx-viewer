import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.querySelector('#app').innerHTML = `
  <h1>GPX Viewer</h1>
  <input type="file" id="gpxInput" accept=".gpx" />
  <div id="map" style="height: 500px;"></div>
`;

const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Optional: just show map now, GPX parser added later
