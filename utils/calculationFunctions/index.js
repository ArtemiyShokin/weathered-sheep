import { bounds } from "../MapData";

export function normalizeToPointDecimal(number) {
  if (number > 200) {
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

export function normalizeForSemitones(number) {
  return Math.round(((number + 90) / (56.7 + 89.2)) * 24 - 12);
}
