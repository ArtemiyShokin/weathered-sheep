import { useState, useRef, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Marker, TileLayer, ImageOverlay } from "react-leaflet";

import { StyledMapContainer } from "./Map.styled";
import MapEventsHandler from "@/utils/MapEventsHandler";
import animateSheep from "@/utils/animateSheep";
import randomPositionInBounds from "@/utils/randomPosition";
import { bounds } from "@/utils/MapData";
import randomDuration from "@/utils/randomDuration";

const zoom = 4;

export default function Map({ sheep, setSheep }) {
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
    const { lat: latitude, lng: longitude } = event.latlng;
    alert(`latitude: ${latitude} longitude: ${longitude}`);
  }

  // make the sheep move
  useEffect(() => {
    function wander() {
      sheepRef.current.forEach((oneSheep) => {
        const [latitude, longitude] = randomPositionInBounds();
        const animationDuration = randomDuration(8000, 15000);
        setSheep((prevSheep) =>
          prevSheep.map((aSheep) =>
            aSheep.id === oneSheep.id
              ? { ...aSheep, weatherLocation: [latitude, longitude] }
              : aSheep
          )
        );

        animateSheep(
          oneSheep.id,
          sheepRef,
          animationRefs,
          setSheep,
          latitude,
          longitude,
          animationDuration
        );
      });
    }

    wander();
    const interval = setInterval(wander, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledMapContainer
      center={[50, 30]}
      zoom={zoom}
      maxZoom={zoom}
      minZoom={zoom}
      dragging={false}
      zoomControl={false}
    >
      <ImageOverlay
        url="/assets/image-assets/greengrass.jpg"
        bounds={bounds}
        opacity={0.35}
      />
      {sheep.map((oneSheep) => (
        <Marker
          key={oneSheep.id}
          position={oneSheep.position}
          icon={sheepMarker}
        />
      ))}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapEventsHandler handleMapClick={handleMapClick} />
    </StyledMapContainer>
  );
}
