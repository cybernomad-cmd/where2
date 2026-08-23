import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 12);
  }, [map, latitude, longitude]);

  return null;
}

const cityMarkerIcon = L.divIcon({
  className: "city-map-marker",
  html: `
    <div class="city-map-marker-pin">
      <span></span>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

function CityMap({ city }) {
  if (!city) {
    return null;
  }

  const latitude = Number(city.latitude);
  const longitude = Number(city.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return (
    <section
      className="city-map-section"
      aria-label={`Map showing ${city.name}`}
    >
      <div className="page-container">
        <div className="city-map-header">
          <div>
            <p className="eyebrow">Explore the location</p>

            <h2>Where is {city.name}?</h2>

            <p>
              Explore the location on the map and get a
              better sense of where this city is situated.
            </p>
          </div>

          <div className="city-map-coordinates">
            <span>Coordinates</span>

            <strong>
              {latitude.toFixed(4)},{" "}
              {longitude.toFixed(4)}
            </strong>
          </div>
        </div>

        <div className="city-map-wrapper">
          <MapContainer
            center={[latitude, longitude]}
            zoom={12}
            scrollWheelZoom={true}
            className="city-map"
          >
            <MapView
              latitude={latitude}
              longitude={longitude}
            />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[latitude, longitude]}
              icon={cityMarkerIcon}
            >
              <Popup>
                <strong>
                  {city.name}, {city.country}
                </strong>

                {city.region && (
                  <div>{city.region}</div>
                )}

                <div>
                  {latitude.toFixed(4)},{" "}
                  {longitude.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="city-map-footer">
          <span>
            Drag to explore
          </span>

          <span>
            Scroll to zoom
          </span>

          <span>
            OpenStreetMap
          </span>
        </div>
      </div>
    </section>
  );
}

export default CityMap;