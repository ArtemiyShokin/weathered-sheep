import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import { latLngToVector3 } from "@/utils/calculationFunctions";
import wanderSheep from "@/utils/animateSheep/animateSheepUpdate";
import sheepSound from "@/utils/sheepSound";
import { earthRadius } from "../3DWorld";
import { useAnimations } from "@react-three/drei";

const _up = new THREE.Vector3(0, 1, 0);
const _normal = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _matrix = new THREE.Matrix4();

export default function Sheep({
  sheep,
  onSheepPositionUpdate,
  onSheepWeatherUpdate,
  sheepMovementActivated,
}) {
  const gltf = useLoader(GLTFLoader, "/assets/models/DollySheep.glb");
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  const meshRef = useRef();
  const seedRef = useRef([sheep.position[0], sheep.position[1]]);
  const stateRef = useRef("wandering");
  const nextEventRef = useRef(Math.random() * 10 + 5);

  const { actions, names } = useAnimations(gltf.animations, meshRef);
  const walkActionRef = useRef(null);

  useEffect(() => {
    const action = actions["newrigAction"];
    if (!action) return;
    action.play();
    action.paused = true;
    walkActionRef.current = action;
  }, [actions, names]);

  useEffect(() => {
    if (!walkActionRef.current) return;
    if (!sheepMovementActivated) {
      walkActionRef.current.paused = true;
    } else {
      walkActionRef.current.paused = stateRef.current === "stopped";
    }
  }, [sheepMovementActivated]);

  const positionRef = useRef([...sheep.position]);
  const velocityRef = useRef([...sheep.velocity]);

  const [x, y, z] = latLngToVector3(
    sheep.position[0],
    sheep.position[1],
    earthRadius
  );

  function applyPosAndOrientation(mesh, px, py, pz, lat, lng, velLat, velLng) {
    mesh.position.set(px, py, pz);
    _normal.set(px, py, pz).normalize();

    const speed = velLat !== undefined ? Math.hypot(velLat, velLng) : 0;

    if (speed > 1e-6) {
      // Step a tiny bit in velocity direction, convert to 3D → gives the tangent
      const ε = 1e-4;
      const [fx, fy, fz] = latLngToVector3(
        lat + velLat * ε,
        lng + velLng * ε,
        earthRadius
      );
      _forward.set(fx - px, fy - py, fz - pz);

      // Re-orthogonalize: strip out any radial component so it's truly tangent
      _forward.addScaledVector(_normal, -_forward.dot(_normal)).normalize();

      // right = forward × normal
      _right.crossVectors(_forward, _normal);

      // Assumes GLTF model faces -Z (standard). Builds X=right, Y=up, Z=-forward
      _forward.negate();
      _matrix.makeBasis(_right, _normal, _forward);
      mesh.quaternion.setFromRotationMatrix(_matrix);
    } else {
      // No velocity yet (initial mount) — just stand upright on the surface
      mesh.quaternion.setFromUnitVectors(_up, _normal);
    }
  }

  useEffect(() => {
    if (!meshRef.current) return;
    applyPosAndOrientation(meshRef.current, x, y, z);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !sheepMovementActivated) return;

    const time = state.clock.elapsedTime;

    if (time >= nextEventRef.current) {
      if (stateRef.current === "wandering") {
        stateRef.current = "stopped";
        nextEventRef.current = time + Math.random() * 6 + 3;
        if (walkActionRef.current) walkActionRef.current.paused = true;

        const [latitude, longitude] = positionRef.current;
        async function startFetching() {
          const response = await fetch(
            `/api/open-meteo?latitude=${latitude}&longitude=${longitude}`
          );
          if (!response.ok) {
            console.error(`Weather fetch failed: ${response.status}`);
            return;
          }
          const weather = await response.json();
          onSheepWeatherUpdate(
            sheep.id,
            weather.current.temperature_2m,
            weather.current.wind_speed_10m,
            weather.current.relative_humidity_2m
          );
          sheepSound(
            weather.current.relative_humidity_2m,
            weather.current.wind_speed_10m,
            weather.current.temperature_2m
          );
        }
        startFetching();
      } else {
        stateRef.current = "wandering";
        nextEventRef.current = time + Math.random() * 16 + 3;
        if (walkActionRef.current) walkActionRef.current.paused = false;
      }
    }

    if (stateRef.current === "stopped") return;

    const { newLatitude, newLongitude, newVelocity } = wanderSheep(
      {
        ...sheep,
        position: positionRef.current,
        velocity: velocityRef.current,
      },
      state.clock.elapsedTime,
      seedRef.current
    );

    positionRef.current = [newLatitude, newLongitude];
    velocityRef.current = newVelocity;

    const [newX, newY, newZ] = latLngToVector3(
      newLatitude,
      newLongitude,
      earthRadius
    );
    applyPosAndOrientation(
      meshRef.current,
      newX,
      newY,
      newZ,
      newLatitude,
      newLongitude,
      newVelocity[0],
      newVelocity[1]
    );
    onSheepPositionUpdate(sheep.id, newLatitude, newLongitude, newVelocity);
  });

  return (
    // <mesh ref={meshRef} position={[x, y, z]}>
    //   <sphereGeometry args={[0.1]} />
    //   <meshStandardMaterial color="orange" />
    // </mesh>
    <primitive ref={meshRef} object={scene} scale={0.1} position={[x, y, z]} />
  );
}
