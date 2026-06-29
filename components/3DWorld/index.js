import React, { Suspense, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  TrackballControls,
  Html,
  useProgress,
  useTexture,
} from "@react-three/drei";
import Sheep from "@/components/3DSheep";
import { StyledCanvas } from "./3DWorld.styled";
import { vector3ToLatLng } from "@/utils/calculationFunctions";

export const earthRadius = 2;

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

function Earth({ isWireframe, ...props }) {
  const meshRef = useRef(null);
  const texture = useTexture("/assets/image-assets/earth-day-map.jpg");

  return (
    <mesh {...props} ref={meshRef}>
      <sphereGeometry
        args={isWireframe ? [earthRadius, 16, 16] : [earthRadius, 32, 32]}
      />
      <meshStandardMaterial
        key={isWireframe ? "wireframe" : "textured"}
        map={isWireframe ? null : texture}
        color={isWireframe ? "#f9ca63" : "#fceac6"}
        wireframe={isWireframe}
      />
    </mesh>
  );
}
export default function ThreeScene({
  sheep,
  handleSheepPositionUpdate,
  handleSheepWeatherUpdate,
  sheepMovementActivated,
  soundVersion,
  handleSetActive,
  onSetAllSheepNotActive,
  clickDestination,
  onSetClickDestination,
  isWireframe,
}) {
  function handleSheepClickPosition(event) {
    const point = event.point;
    const [lat, lng] = vector3ToLatLng(point, earthRadius);
    const activeSheep = sheep.find((oneSheep) => oneSheep.active);
    if (activeSheep) {
      onSetClickDestination({ id: activeSheep.id, lat, lng });
    }
  }

  return (
    <StyledCanvas onPointerMissed={onSetAllSheepNotActive}>
      <Suspense fallback={<Loader />}>
        <EffectComposer>
          <Bloom luminanceThreshold={1.2} intensity={0.5} />
        </EffectComposer>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI / 2}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Earth onClick={handleSheepClickPosition} isWireframe={isWireframe} />
        {sheep.map((oneSheep) => {
          return (
            <Sheep
              key={oneSheep.id}
              sheep={oneSheep}
              onSheepPositionUpdate={handleSheepPositionUpdate}
              onSheepWeatherUpdate={handleSheepWeatherUpdate}
              sheepMovementActivated={sheepMovementActivated}
              onSetActive={handleSetActive}
              soundVersion={soundVersion}
              clickDestination={
                clickDestination?.id === oneSheep.id ? clickDestination : null
              }
            />
          );
        })}

        <TrackballControls />
      </Suspense>
    </StyledCanvas>
  );
}
