import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import GPXParser from "gpxparser";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setFileNames(files.map((file) => file.name));

    const readFiles = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const gpx = new GPXParser();
            gpx.parse(event.target.result);
            const points = gpx.tracks[0]?.points.map((pt) => [pt.lat, pt.lon]) || [];
            resolve({ name: file.name, points });
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    try {
      const allTracks = await Promise.all(readFiles);
      setTracks(allTracks.filter(t => t.points.length > 0));
    } catch (err) {
      console.error("Error parsing GPX files:", err);
    }
  };

  const mapCenter =
    tracks.length > 0 && tracks[0].points.length > 0 ? tracks[0].points[0] : [0, 0];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">GPX Multi-Track Viewer</h1>

        <input
          type="file"
          accept=".gpx"
          multiple
          onChange={handleFileUpload}
          className="mb-4"
        />

        {fileNames.length > 0 && (
          <ul className="mb-4 text-gray-600 list-disc list-inside">
            {fileNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        )}

        {tracks.length > 0 ? (
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="rounded-xl overflow-hidden"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {tracks.map((track, index) => (
              <React.Fragment key={index}>
                <Polyline positions={track.points} color="blue" />
                <Marker position={track.points[0]}>
                  <Popup>{track.name} Start</Popup>
                </Marker>
                <Marker position={track.points[track.points.length - 1]}>
                  <Popup>{track.name} End</Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        ) : (
          <p className="text-gray-500">Upload one or more .gpx files to view tracks.</p>
        )}
      </div>
    </div>
  );
}
