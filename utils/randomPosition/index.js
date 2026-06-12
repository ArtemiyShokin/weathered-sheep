import { bounds } from "../MapData";
export default function randomPositionInBounds() {
  const latitude = bounds[1][0] + Math.random() * (bounds[0][0] - bounds[1][0]);

  const longitude =
    bounds[0][1] + Math.random() * (bounds[1][1] - bounds[0][1]);

  return [latitude, longitude];
}
