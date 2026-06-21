import { createNoise3D } from "simplex-noise";

const noise = createNoise3D();

export default function wanderSheep(sheep, time) {
  const speed = 0.1;
  const amplitude = 20;

  const latOffset = noise(sheep.id, time * speed, 0) * amplitude;
  const lngOffset = noise(sheep.id, 0, time * speed) * amplitude;

  return {
    newLatitude: sheep.position[0] + latOffset,
    newLongitude: sheep.position[1] + lngOffset,
  };
}
