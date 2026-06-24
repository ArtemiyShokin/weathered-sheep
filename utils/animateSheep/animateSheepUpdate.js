import { createNoise3D } from "simplex-noise";

const noise = createNoise3D();

export default function wanderSheep(sheep, time, seed) {
  const speed = 0.1;
  const steeringStrength = 0.002;
  const maxVelocity = 0.05;

  const latitudeSteering =
    noise(seed[0] * 0.01, time * speed, 0) * steeringStrength;
  const longitudeSteering =
    noise(seed[1] * 0.01, 0, time * speed) * steeringStrength;

  // Change existing velocity
  let latitudeVelocity = sheep.velocity[0] + latitudeSteering;

  let longitudeVelocity = sheep.velocity[1] + longitudeSteering;

  // Clamp velocity
  latitudeVelocity = Math.max(
    -maxVelocity,
    Math.min(maxVelocity, latitudeVelocity)
  );

  longitudeVelocity = Math.max(
    -maxVelocity,
    Math.min(maxVelocity, longitudeVelocity)
  );

  // Move using velocity
  const newLatitude = sheep.position[0] + latitudeVelocity;

  let newLongitude = sheep.position[1] + longitudeVelocity;

  // Clamp latitude and reflect velocity so sheep bounce off the poles
  const clampedLatitude = Math.max(-90, Math.min(90, newLatitude));
  if (clampedLatitude !== newLatitude) latitudeVelocity = -latitudeVelocity;

  // Wrap longitude
  if (newLongitude > 180) newLongitude -= 360;

  if (newLongitude < -180) newLongitude += 360;

  return {
    newLatitude: clampedLatitude,
    newLongitude,
    newVelocity: [latitudeVelocity, longitudeVelocity],
  };
}
