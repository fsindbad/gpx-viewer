import React from "react";
import GpxViewer from "./components/GpxViewer";

function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-2xl mx-auto pt-10">
        <GpxViewer />
      </div>
    </main>
  );
}

export default App;