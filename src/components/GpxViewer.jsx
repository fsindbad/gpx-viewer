import React, { useState } from "react";
import GPX from "gpxparser";

function GpxViewer() {
  const [tracks, setTracks] = useState([]);
  const [stats, setStats] = useState(null);

  const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  const newTracks = [];

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const gpx = new GPXParser();
      gpx.parse(event.target.result);
      const points = gpx.tracks[0].points.map((pt) => [pt.lat, pt.lon]);
      newTracks.push({ name: file.name, points });

      if (newTracks.length === files.length) {
        setTracks(newTracks);
      }
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
            {t.name} — {t.track.points.length} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GpxViewer;
