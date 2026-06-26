import { createNoise3D } from "simplex-noise";
import * as THREE from "three";
import { latLngToVector3 } from "../calculationFunctions";
import { earthRadius } from "@/components/3DWorld";
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

const _upAxis = new THREE.Vector3(0, 1, 0);
const _surfaceNormal = new THREE.Vector3();
const _forwardDirection = new THREE.Vector3();
const _rightDirection = new THREE.Vector3();
const _orientationMatrix = new THREE.Matrix4();
export function applyPosAndOrientation(
  mesh,
  positionX,
  positionY,
  positionZ,
  latitude,
  longitude,
  latitudeVelocity,
  longitudeVelocity
) {
  mesh.position.set(positionX, positionY, positionZ);
  _surfaceNormal.set(positionX, positionY, positionZ).normalize();

  const speed = Math.hypot(latitudeVelocity, longitudeVelocity);

  if (speed > 1e-6) {
    const epsilon = 1e-4;
    const [probeX, probeY, probeZ] = latLngToVector3(
      latitude + latitudeVelocity * epsilon,
      longitude + longitudeVelocity * epsilon,
      earthRadius
    );
    _forwardDirection.set(
      probeX - positionX,
      probeY - positionY,
      probeZ - positionZ
    );
    _forwardDirection
      .addScaledVector(_surfaceNormal, -_forwardDirection.dot(_surfaceNormal))
      .normalize();
    _rightDirection.crossVectors(_forwardDirection, _surfaceNormal);
    _forwardDirection.negate();
    _orientationMatrix.makeBasis(
      _rightDirection,
      _surfaceNormal,
      _forwardDirection
    );
    mesh.quaternion.setFromRotationMatrix(_orientationMatrix);
  } else {
    mesh.quaternion.setFromUnitVectors(_upAxis, _surfaceNormal);
  }
}
