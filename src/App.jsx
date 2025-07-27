import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import GPXParser from "gpxparser";

export default function App() {
  const [track, setTrack] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpx = new GPXParser();
      gpx.parse(event.target.result);
      const points = gpx.tracks[0].points.map((pt) => [pt.lat, pt.lon]);
      setTrack(points);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">GPX Sailing Track Viewer</h1>

        <input
          type="file"
          accept=".gpx"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {fileName && <p className="mb-2 text-gray-600">Loaded: {fileName}</p>}

        {track.length > 0 ? (
          <MapContainer
            center={track[0]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="rounded-xl overflow-hidden"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Polyline positions={track} color="blue" />
            <Marker position={track[0]}>
              <Popup>Start</Popup>
            </Marker>
            <Marker position={track[track.length - 1]}>
              <Popup>End</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-gray-500">Upload a .gpx file to view your sailing track.</p>
        )}
      </div>
    </div>
  );
}

