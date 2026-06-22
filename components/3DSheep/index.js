import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { latLngToVector3 } from "@/utils/calculationFunctions";
import wanderSheep from "@/utils/animateSheep/animateSheepUpdate";
import sheepSound from "@/utils/sheepSound";
import { earthRadius } from "../3DWorld";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

function Model() {
  const gltf = useLoader(GLTFLoader, "/assets/models/DollySheep.glb");
  return (
    <>
      <primitive object={gltf.scene} scale={0.1}></primitive>
    </>
  );
}

export default function Sheep({
  sheep,
  onSheepPositionUpdate,
  onSheepWeatherUpdate,
  sheepMovementActivated,
}) {
  const meshRef = useRef();
  const seedRef = useRef([sheep.position[0], sheep.position[1]]);
  const stateRef = useRef("wandering");
  const nextEventRef = useRef(Math.random() * 10 + 5); //  stop in 5–15s

  const [x, y, z] = latLngToVector3(
    sheep.position[0],
    sheep.position[1],
    earthRadius
  );

  const positionRef = useRef([...sheep.position]);
  const velocityRef = useRef([...sheep.velocity]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (!sheepMovementActivated) return;

    const time = state.clock.elapsedTime;

    if (time >= nextEventRef.current) {
      if (stateRef.current === "wandering") {
        stateRef.current = "stopped";
        nextEventRef.current = time + Math.random() * 6 + 3;

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
        startFetching(latitude, longitude);
      } else {
        stateRef.current = "wandering";
        nextEventRef.current = time + Math.random() * 16 + 3; // wander for 5–15s
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

    const [x, y, z] = latLngToVector3(newLatitude, newLongitude, earthRadius);

    meshRef.current.position.set(x, y, z);

    onSheepPositionUpdate(sheep.id, newLatitude, newLongitude, newVelocity);
  });
  return (
    // <mesh ref={meshRef} position={[x, y, z]}>
    //   <sphereGeometry args={[0.1]} />
    //   <meshStandardMaterial color="orange" />
    // </mesh>
    <Model />
  );
}
