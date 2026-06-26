import { bounds } from "../MapData";

export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

export function vector3ToLatLng(point, radius) {
  const lat = 90 - Math.acos(point.y / radius) * (180 / Math.PI);
  let lng = Math.atan2(point.z, -point.x) * (180 / Math.PI) - 180;
  if (lng < -180) lng += 360;
  return [lat, lng];
}

export function normalizeToPointDecimal(number) {
  if (number >= 200) {
    return number / 300;
  }
  if (number > 100) {
    return number / 200;
  }
  return number / 100;
}

export function convertTo16bitRange(value, minInput, maxInput) {
  return Math.round(((value - minInput) / (maxInput - minInput)) * 15 + 1);
}

export function randomDuration(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomPositionInBounds() {
  const latitude = bounds[1][0] + Math.random() * (bounds[0][0] - bounds[1][0]);

  const longitude =
    bounds[0][1] + Math.random() * (bounds[1][1] - bounds[0][1]);

  return [latitude, longitude];
}

export function randomPositionNoBounds() {
  const latitude = -90 + Math.random() * 180;
  const longitude = -180 + Math.random() * 360;

  return [latitude, longitude];
}

export function normalizeForSemitones(number) {
  return Math.round(((number + 90) / (56.7 + 89.2)) * 24 - 12);
}
