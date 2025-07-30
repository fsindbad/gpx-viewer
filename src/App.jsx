import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ First, import image URLs (Vite will bundle them)
import iconUrl from "./assets/icons/marker-icon.png?url";
import iconRetinaUrl from "./assets/icons/marker-icon-2x.png?url";
import shadowUrl from "./assets/icons/marker-shadow.png?url";

// Right after the icon imports
console.log({ iconUrl, iconRetinaUrl, shadowUrl }); // paste these URLs into your address bar


// ✅ Then use them
const customIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});



// ✅ Optionally override Leaflet’s fallback logic
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});


const preloadFiles = [
  "/tracks/sample1.gpx",
  "/tracks/sample2.gpx",
];

const points = gpx.tracks[0]?.points || [];
if (points.length === 0) {
  console.warn("No points found in GPX track:", name);
}
const latlng = points.map(pt => [pt.lat, pt.lon]);


export default function App() {
  const colors = ["blue", "red", "green", "orange", "purple", "teal", "magenta", "brown"];
  const [tracks, setTracks] = useState([]);
  const [loadedFiles, setLoadedFiles] = useState([]);

  const parseGPX = async (text, name) => {
    const gpx = new GPXParser();
    gpx.parse(text);
    const points = gpx.tracks[0]?.points || [];
    const latlng = points.map((pt) => [pt.lat, pt.lon]);

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].lon - points[i - 1].lon;
      const dy = points[i].lat - points[i - 1].lat;
      totalDistance += Math.sqrt(dx * dx + dy * dy) * 111.32; // rough km
    }

    return {
      name,
      latlng,
      stats: {
        distance: totalDistance.toFixed(2),
        points: points.length,
      },
    };
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const parsed = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const track = await parseGPX(event.target.result, file.name);
            resolve(track);
          };
          reader.readAsText(file);
        });
      })
    );
    setTracks(parsed);
    setLoadedFiles(files.map((f) => f.name));
  };

  useEffect(() => {
    Promise.all(
      preloadFiles.map(async (url) => {
        const res = await fetch(url);
        const text = await res.text();
        return parseGPX(text, url.split("/").pop());
      })
    ).then((results) => {
      setTracks(results);
      setLoadedFiles(results.map((r) => r.name));
    });
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">
          GPX Sailing Track Viewer
        </h1>

        <input
          type="file"
          accept=".gpx"
          multiple
          onChange={handleFileUpload}
          className="mb-4 border p-2 rounded"
        />

        {loadedFiles.length > 0 && (
          <ul className="mb-4 text-sm text-gray-700">
            {loadedFiles.map((name, idx) => (
              <li key={idx}>✅ {name}</li>
            ))}
          </ul>
        )}

        {tracks.length > 0 ? (
          <MapContainer
            center={tracks[0].latlng[0]}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
            className="rounded-xl overflow-hidden mb-4"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {tracks.map((track, i) => (
             const color = colors[i % colors.length];
              console.log(`Track ${i} polyline color:`, color);
              return (
              <React.Fragment key={i}>
                <Polyline
                  positions={track.latlng} 
                  pathOptions={{ color, weight: 5, opacity: 0.8 }}
                />
                <Marker
                  position={track.latlng[0]}
                  icon={customIcon} // ✅ assign custom icon
                >
                  <Popup>Start: {track.name}</Popup>
                </Marker>
                <Marker
                  position={track.latlng[track.latlng.length - 1]}
                  icon={customIcon} // ✅ assign custom icon
                >
                  <Popup>End: {track.name}</Popup>
                </Marker>
              </React.Fragment>
            ))}


          </MapContainer>
        ) : (
          <p className="text-gray-500">
            Upload or preload a .gpx file to view sailing tracks.
          </p>
        )}

        {tracks.length > 0 && (
          <div className="mt-4 bg-gray-100 rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">
              Track Statistics
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {tracks.map((track, idx) => (
                <li key={idx} className="bg-white p-2 rounded shadow">
                  <strong>{track.name}</strong>: {track.stats.distance} km, {" "}
                  {track.stats.points} points
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
        </div>
      <!-- hitwebcounter Code START -->
      <a href="https://www.hitwebcounter.com" target="_blank">
      <img src="https://hitwebcounter.com/counter/counter.php?page=21274072&style=0001&nbdigits=5&type=page&initCount=0" title="Counter Widget" Alt="Visit counter For Websites"   border="0" /></a>                
    </div>
    </div>
  );
}
