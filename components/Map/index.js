import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import { StyledMapContainer } from "./Map.styled";
import { useState, useRef, useEffect } from "react";
import MapEventsHandler from "@/utils/MapEventsHandler";
import { TileLayer, ImageOverlay } from "react-leaflet";
import animateTo from "@/utils/animateSheep";
import randomPositionInBounds from "@/utils/randomPosition";

const zoom = 4;

const bounds = [
  [64.8, -12],
  [28.5, 72],
];

const animationDuration = 8000;

export default function Map() {
  const [sheep, setSheep] = useState([
    {
      id: 1,
      position: [50, 30],
    },
    {
      id: 2,
      position: [40, 20],
    },
    {
      id: 3,
      position: [33, 40],
    },
  ]);

  const sheepRef = useRef(sheep);
  const animationRefs = useRef({});

  const sheepMarker = L.icon({
    iconUrl: "/assets/image-assets/sheepplaceholder.webp",
    iconSize: [80, 80],
  });

  // Keep ref synchronized with state
  useEffect(() => {
    sheepRef.current = sheep;
  }, [sheep]);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(animationRefs.current).forEach((animationId) =>
        cancelAnimationFrame(animationId)
      );
    };
  }, []);

  function handleMapClick(event) {
    const { lat, lng } = event.latlng;
    alert(`latitude: ${lat} longitude: ${lng}`);
  }

  // make the sheep move
  useEffect(() => {
    function wander() {
      sheepRef.current.forEach((oneSheep) => {
        const [lat, lng] = randomPositionInBounds();
        animateTo(
          oneSheep.id,
          sheepRef,
          animationRefs,
          setSheep,
          lat,
          lng,
          animationDuration
        );
      });
    }

    wander();
    const interval = setInterval(wander, animationDuration + 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledMapContainer
      center={[50, 30]}
      zoom={zoom}
      maxZoom={zoom}
      minZoom={zoom}
    >
      <ImageOverlay
        url="/assets/image-assets/greengrass.jpg"
        bounds={bounds}
        opacity={0.35}
      />
      {sheep.map((sheep) => (
        <Marker key={sheep.id} position={sheep.position} icon={sheepMarker} />
      ))}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapEventsHandler handleMapClick={handleMapClick} />
      <Rectangle bounds={bounds} pathOptions={{ color: "green" }} />
    </StyledMapContainer>
  );
}
