import React, { useState } from "react";
import GPX from "gpxparser";

function GpxViewer() {
  const [tracks, setTracks] = useState([]);
  const [stats, setStats] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const gpx = new GPX();
        gpx.parse(e.target.result);

        const track = gpx.tracks[0]; // first track per file
        const distance = gpx.calculateDistance();
        const elevation = gpx.calculateElevationGain();

        setTracks((prev) => [...prev, { name: file.name, track }]);
        setStats((prev) => ({
          totalDistance: (prev?.totalDistance || 0) + distance,
          totalElevation: (prev?.totalElevation || 0) + elevation,
        }));
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">GPX File Viewer</h2>
      <input
        type="file"
        multiple
        accept=".gpx"
        onChange={handleFileUpload}
        className="mb-4"
        
      />
      {stats && (
        <div className="mb-4">
          <p><strong>Total Distance:</strong> {(stats.totalDistance / 1000).toFixed(2)} km</p>
          <p><strong>Total Elevation:</strong> {stats.totalElevation.toFixed(0)} m</p>
        </div>
      )}
      <ul>
        {tracks.map((t, i) => (
          <li key={i} className="mb-2">
            📍 {t.name} — {t.track.points.length} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GpxViewer;
