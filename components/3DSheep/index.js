import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { latLngToVector3, randomDuration } from "@/utils/calculationFunctions";
import wanderSheep from "@/utils/animateSheep/animateSheepUpdate";
import { mp3Sound, synthSound } from "@/utils/sheepSound";
import { earthRadius } from "../3DWorld";
import { useAnimations } from "@react-three/drei";
import { applyPosAndOrientation } from "@/utils/animateSheep/animateSheepUpdate";
import Marker from "../3DMarker";

export default function Sheep({
  sheep,
  onSheepPositionUpdate,
  onSheepWeatherUpdate,
  sheepMovementActivated,
  soundVersion,
  onSetActive,
  clickDestination,
}) {
  const model = useLoader(GLTFLoader, "/assets/models/DollySheep.glb");
  const scene = useMemo(() => clone(model.scene), [model.scene]);

  const meshRef = useRef();
  const seedRef = useRef([sheep.position[0], sheep.position[1]]);
  const stateRef = useRef("wandering");
  const nextEventRef = useRef(null);
  const abortControllerRef = useRef(null);
  const frameCountRef = useRef(0);
  const clickDestinationRef = useRef(null);

  useEffect(() => {
    clickDestinationRef.current = clickDestination;
    if (
      clickDestinationRef.current &&
      walkActionRef.current &&
      stateRef.current === "stopped"
    ) {
      walkActionRef.current.paused = false;
      stateRef.current = "wandering";
    }
  }, [clickDestination]);

  const { actions } = useAnimations(model.animations, meshRef);
  const walkActionRef = useRef(null);

  // Mirror prop into a ref so the animation-load effect can read the current
  // value without needing sheepMovementActivated in its deps array.
  const sheepMovementActivatedRef = useRef(sheepMovementActivated);
  sheepMovementActivatedRef.current = sheepMovementActivated;

  function syncPause() {
    if (walkActionRef.current) {
      walkActionRef.current.paused =
        !sheepMovementActivatedRef.current || stateRef.current === "stopped";
    }
  }

  useEffect(() => {
    const action = actions["newrigAction"];
    if (!action) return;
    action.play();
    walkActionRef.current = action;
    syncPause();
  }, [actions]);

  useEffect(() => {
    syncPause();
  }, [sheepMovementActivated]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const positionRef = useRef([...sheep.position]);
  const velocityRef = useRef([...sheep.velocity]);

  useEffect(() => {
    if (!meshRef.current) return;
    const [latitude, longitude] = positionRef.current;
    const [positionX, positionY, positionZ] = latLngToVector3(
      latitude,
      longitude,
      earthRadius
    );
    applyPosAndOrientation(
      meshRef.current,
      positionX,
      positionY,
      positionZ,
      latitude,
      longitude,
      0,
      0
    );
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !sheepMovementActivated) return;

    const time = state.clock.elapsedTime;

    if (nextEventRef.current === null) {
      nextEventRef.current = time + randomDuration(2, 14);
    }

    if (time >= nextEventRef.current && !clickDestinationRef.current) {
      if (stateRef.current === "wandering") {
        stateRef.current = "stopped";
        nextEventRef.current = time + randomDuration(3, 6);
        if (walkActionRef.current) walkActionRef.current.paused = true;

        // Abort any previous fetch before starting a new one
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        const [latitude, longitude] = positionRef.current;
        (async () => {
          try {
            const response = await fetch(
              `/api/open-meteo?latitude=${latitude}&longitude=${longitude}`,
              { signal }
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
            if (soundVersion === "mp3") {
              mp3Sound(
                weather.current.relative_humidity_2m,
                weather.current.wind_speed_10m,
                weather.current.temperature_2m
              );
            } else {
              synthSound(
                weather.current.relative_humidity_2m,
                weather.current.wind_speed_10m,
                weather.current.temperature_2m
              );
            }
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Weather fetch error:", error);
            }
          }
        })();
      } else {
        stateRef.current = "wandering";
        nextEventRef.current = time + randomDuration(2, 10);
        if (walkActionRef.current) walkActionRef.current.paused = false;
      }
    }

    if (stateRef.current === "stopped" && !clickDestinationRef.current) return;

    const { newLatitude, newLongitude, newVelocity } = wanderSheep(
      { position: positionRef.current, velocity: velocityRef.current },
      time,
      seedRef.current,
      clickDestinationRef.current
    );

    if (clickDestinationRef.current) {
      const destinationLat = clickDestinationRef.current.lat - newLatitude;
      const destinationLng = clickDestinationRef.current.lng - newLongitude;
      if (Math.hypot(destinationLat, destinationLng) < 1)
        clickDestinationRef.current = null;
    }

    positionRef.current = [newLatitude, newLongitude];
    velocityRef.current = newVelocity;

    const [newPositionX, newPositionY, newPositionZ] = latLngToVector3(
      newLatitude,
      newLongitude,
      earthRadius
    );
    applyPosAndOrientation(
      meshRef.current,
      newPositionX,
      newPositionY,
      newPositionZ,
      newLatitude,
      newLongitude,
      newVelocity[0],
      newVelocity[1]
    );
    frameCountRef.current += 1;
    if (frameCountRef.current % 6 === 0) {
      onSheepPositionUpdate(sheep.id, newLatitude, newLongitude, newVelocity);
    }
  });

  return (
    <group ref={meshRef} onClick={() => onSetActive(sheep.id)}>
      <Marker
        position={sheep.active ? [0, 0.7, 0] : [0, 0.6, 0]}
        color={sheep.color}
        active={sheep.active}
      />
      <primitive object={scene} scale={0.1} />{" "}
    </group>
  );
}
