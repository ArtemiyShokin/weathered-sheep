import { useMapEvents } from "react-leaflet";
export default function MapEventsHandler({ handleMapClick }) {
  useMapEvents({
    click: (event) => handleMapClick(event),
  });
  return null;
}
