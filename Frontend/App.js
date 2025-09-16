import React, { useEffect, useState } from "react";
import BusMap from "./BusMap";
import "./App.css";

function App() {
  const [buses, setBuses] = useState([]);
  const [showGhosts, setShowGhosts] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/buses")
      .then((res) => res.json())
      .then((data) => setBuses(data.buses || []));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/buses`);

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket update:", data.buses);
      setBuses(data.buses || []);
    };
    ws.onclose = () => console.log("❌ WebSocket closed");
    ws.onerror = (err) => console.error("⚠️ WebSocket error:", err);

    return () => ws.close();
  }, []);

  return (
    <div className="app-container">
      <BusMap buses={buses} showGhosts={showGhosts} setShowGhosts={setShowGhosts} />
    </div>
  );
}

export default App;
