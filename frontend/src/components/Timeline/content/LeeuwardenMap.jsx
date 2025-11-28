import React, { useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom Icons
const createCustomIcon = (color, isPulsing = false) => {
  const iconHtml = `
    <div class="relative flex items-center justify-center">
      ${
        isPulsing
          ? `
        <div class="absolute w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-50"></div>
      `
          : ""
      }
      <div class="relative w-10 h-10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

const redIcon = createCustomIcon("#dc2626", false)
const blueIcon = createCustomIcon("#2563eb", true)

// Component to fit map to markers
const FitBounds = ({ bounds }) => {
  const map = useMap()

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])

  return null
}

const LeeuwardenMap = () => {
  const [map, setMap] = React.useState(null)

  // Prevent body scroll when touching map
  const handleMapTouchStart = e => {
    e.stopPropagation()
    document.body.style.overflow = "hidden"
  }

  const handleMapTouchEnd = e => {
    e.stopPropagation()
    document.body.style.overflow = "unset"
  }

  const panMap = direction => {
    if (!map) return
    const panAmount = 100 // pixels to pan

    switch (direction) {
      case "up":
        map.panBy([0, -panAmount])
        break
      case "down":
        map.panBy([0, panAmount])
        break
      case "left":
        map.panBy([-panAmount, 0])
        break
      case "right":
        map.panBy([panAmount, 0])
        break
    }
  }

  // Museum locations
  const historicLocation = {
    position: [53.2012, 5.7887],
    name: "Eysingahuis",
    period: "1925-1956",
    address: "Turfmarkt, Leeuwarden",
    description: "Eerste locatie van het museum",
  }

  const currentLocation = {
    position: [53.17968462648499, 5.7891327408064095],
    name: "Jij bent hier!",
    period: "1987-heden",
    address: "Felling 6, 8912 CG Leeuwarden",
    description: "Fries Landbouwmuseum sinds 1987",
  }

  // Bounds for fitting map
  const bounds = [historicLocation.position, currentLocation.position]

  // Dashed line connecting locations
  const pathOptions = {
    color: "#f97316",
    weight: 3,
    opacity: 0.8,
    dashArray: "10, 10",
    lineCap: "round",
  }

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div
        className="relative w-full h-72 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-700/50"
        style={{ touchAction: "none" }}
        onTouchStart={handleMapTouchStart}
        onTouchMove={e => e.stopPropagation()}
        onTouchEnd={handleMapTouchEnd}
      >
        <MapContainer
          center={[53.1904, 5.7889]}
          zoom={12}
          scrollWheelZoom={false}
          dragging={true}
          tap={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomSnap={0.5}
          zoomDelta={0.5}
          className="w-full h-full"
          zoomControl={true}
          attributionControl={false}
          ref={setMap}
          whenReady={mapInstance => {
            setMap(mapInstance.target)
            mapInstance.target.on("touchstart", e => {
              e.originalEvent.stopPropagation()
            })
          }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fit map to show both markers */}
          <FitBounds bounds={bounds} />

          {/* Connecting Line */}
          <Polyline
            positions={[historicLocation.position, currentLocation.position]}
            pathOptions={pathOptions}
          />

          {/* Historic Location Marker */}
          <Marker position={historicLocation.position} icon={redIcon}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-red-600 mb-1">
                  {historicLocation.name}
                </h3>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {historicLocation.period}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  {historicLocation.address}
                </p>
                <p className="text-xs text-gray-500 italic">
                  {historicLocation.description}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Current Location Marker */}
          <Marker position={currentLocation.position} icon={blueIcon}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-blue-600 mb-1">
                  {currentLocation.name}
                </h3>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {currentLocation.period}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  {currentLocation.address}
                </p>
                <p className="text-xs text-gray-500 italic">
                  {currentLocation.description}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Navigation Controls - Bottom Right Corner */}
        <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto">
          <div className="relative w-28 h-28">
            {/* Up Arrow */}
            <button
              onClick={() => panMap("up")}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-lg shadow-xl border-2 border-gray-300 transition-all active:scale-95"
              aria-label="Pan up"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            {/* Down Arrow */}
            <button
              onClick={() => panMap("down")}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-lg shadow-xl border-2 border-gray-300 transition-all active:scale-95"
              aria-label="Pan down"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Left Arrow */}
            <button
              onClick={() => panMap("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-lg shadow-xl border-2 border-gray-300 transition-all active:scale-95"
              aria-label="Pan left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => panMap("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-lg shadow-xl border-2 border-gray-300 transition-all active:scale-95"
              aria-label="Pan right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-4 py-3 bg-slate-800/30 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
          <span className="text-white text-xs lg:text-sm font-medium">
            1925 - Eysingahuis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full shadow-md animate-pulse"></div>
          <span className="text-white text-xs lg:text-sm font-medium">
            Nu - Jij bent hier
          </span>
        </div>
      </div>
    </div>
  )
}

export default LeeuwardenMap
