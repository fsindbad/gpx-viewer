import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // ADD THIS

// ADD THIS BLOCK
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/marker-icon-2x.png",
  iconUrl: "/icons/marker-icon.png",
  shadowUrl: "/icons/marker-shadow.png",
});

import GPXParser from "gpxparser";

const preloadFiles = [
  "/tracks/sample1.gpx",
  "/tracks/sample2.gpx",
];

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loadedFiles, setLoadedFiles] = useState([]);

  const parseGPX = async (text, name) => {
    const gpx = new GPXParser();
    gpx.parse(text);
    if (!gpx.tracks.length) {
  console.error(`No tracks found in file: ${name}`);
}

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
    (async () => {
      try {
        const results = await Promise.all(
          preloadFiles.map(async (url) => {
            const res = await fetch(url);
            const text = await res.text();
            return parseGPX(text, url.split("/").pop());
          })
        );
        setTracks(results);
        setLoadedFiles(results.map((r) => r.name));
      } catch (err) {
        console.error("Error preloading files:", err);
      }
    })();
  }, []);


  const colors = ["blue", "red", "green", "orange", "purple", "teal", "magenta", "brown"];

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
              <React.Fragment key={i}>
               <Polyline
                  positions={track.latlng}
                  pathOptions={{ color: colors[i % colors.length], weight: 4 }}
                />
                <Marker position={track.latlng[0]}>
                  <Popup>Start: {track.name}</Popup>
                </Marker>
                <Marker position={track.latlng[track.latlng.length - 1]}>
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
                <li key={idx} className="bg-white p-2 rounded shadow flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                  <strong>{track.name}</strong>: {track.stats.distance} km, {track.stats.points} points
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
