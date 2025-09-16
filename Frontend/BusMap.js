import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icons
const healthyMarker = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const ghostMarker = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

// 🔹 AutoFit on first load only
function AutoFit({ buses }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (buses.length > 0 && !hasFitted.current) {
      const bounds = L.latLngBounds(buses.map((b) => [b.latitude, b.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
      hasFitted.current = true;
    }
  }, [buses, map]);

  return null;
}

// 🔹 Custom control for toggle switch
function GhostToggleControl({ showGhosts, setShowGhosts }) {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    controlDiv.style.background = "white";
    controlDiv.style.padding = "6px";
    controlDiv.style.cursor = "pointer";
    controlDiv.style.fontSize = "14px";

    controlDiv.innerHTML = showGhosts ? "👻 Hide Ghosts" : "👻 Show Ghosts";

    controlDiv.onclick = () => {
      setShowGhosts((prev) => !prev);
    };

    const customControl = L.control({ position: "topright" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map, showGhosts, setShowGhosts]);

  return null;
}

function BusMap({ buses, showGhosts, setShowGhosts }) {
  return (
    <MapContainer
      center={[42.3601, -71.0589]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <AutoFit buses={buses} />
      <GhostToggleControl showGhosts={showGhosts} setShowGhosts={setShowGhosts} />

      {buses
        .filter(
          (bus) =>
            bus.latitude &&
            bus.longitude &&
            (showGhosts || bus.status !== "ghost")
        )
        .map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.latitude, bus.longitude]}
            icon={bus.status === "ghost" ? ghostMarker : healthyMarker}
          >
            <Popup>
              <strong>Bus ID:</strong> {bus.id} <br />
              <strong>Status:</strong> {bus.status} <br />
              <strong>Last Update:</strong>{" "}
              {new Date(bus.timestamp * 1000).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default BusMap;
