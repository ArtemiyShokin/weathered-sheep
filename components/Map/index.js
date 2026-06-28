import "leaflet/dist/leaflet.css";
import { CircleMarker, TileLayer } from "react-leaflet";
import XIcon from "@/assets/x.svg";
import { StyledMapContainer } from "./Map.styled";
import {
  StyledWindowContainer,
  StyledMenuBar,
  XButton,
} from "../Global/Global.styled";
import MapEventsHandler from "@/utils/MapEventsHandler";
const zoom = 1;

export default function Map({
  sheep,
  onMapToggle,
  onSetActive,
  onSetClickDestination,
}) {
  function handleMapClick(event) {
    const { lat, lng } = event.latlng;
    const activeSheep = sheep.find((oneSheep) => oneSheep.active);
    if (activeSheep) {
      onSetClickDestination({ id: activeSheep.id, lat, lng });
    }
  }

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
        {sheep.map((oneSheep) => (
          <CircleMarker
            key={oneSheep.id}
            center={oneSheep.position}
            radius={oneSheep.active ? 16 : 8}
            pathOptions={{
              color: oneSheep.color,
              fillColor: oneSheep.color,
              fillOpacity: 0.6,
            }}
            eventHandlers={{ click: () => onSetActive(oneSheep.id) }}
          />
        ))}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapEventsHandler handleMapClick={handleMapClick} />
      </StyledMapContainer>
    </StyledWindowContainer>
  );
}
