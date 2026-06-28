import { useRef, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Marker, TileLayer, ImageOverlay } from "react-leaflet";
import XIcon from "@/assets/x.svg";
import { StyledMapContainer } from "./Map.styled";
import {
  StyledWindowContainer,
  StyledMenuBar,
  XButton,
} from "../Global/Global.styled";
import MapEventsHandler from "@/utils/MapEventsHandler";
import animateSheep from "@/utils/animateSheep";
import { randomPositionInBounds } from "@/utils/calculationFunctions";
import { bounds } from "@/utils/MapData";
import { randomDuration } from "@/utils/calculationFunctions";
const zoom = 1;

export default function Map({
  sheep,
  setSheep,
  sheepMovementActivated,
  onMapToggle,
}) {
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
    if (!sheepMovementActivated) return;
    function wander() {
      sheepRef.current.forEach((oneSheep) => {
        const [latitude, longitude] = randomPositionInBounds();
        const animationDuration = randomDuration(1000, 7999);

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
    const interval = setInterval(wander, 8000);
    return () => clearInterval(interval);
  }, [sheepMovementActivated]);

  return (
    <StyledWindowContainer>
      <StyledMenuBar>
        <XButton onClick={onMapToggle}>
          <XIcon width="10px" height="8px" fill="var(--huemint4)" />
        </XButton>
      </StyledMenuBar>
      <StyledMapContainer
        center={[50, 30]}
        zoom={zoom}
        minZoom={1}
        dragging={true}
        zoomControl={true}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        {/* <ImageOverlay
          url="/assets/image-assets/greengrass.jpg"
          bounds={bounds}
          opacity={0.48}
        /> */}
        {sheep.map((oneSheep) => (
          <Marker
            key={oneSheep.id}
            position={oneSheep.position}
            icon={sheepMarker}
            draggable
          />
        ))}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapEventsHandler handleMapClick={handleMapClick} />
      </StyledMapContainer>
    </StyledWindowContainer>
  );
}
