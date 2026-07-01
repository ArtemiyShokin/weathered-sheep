import React, { Suspense, useRef } from "react";
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
const MOBILE_CAMERA_Z = 8;
const DESKTOP_CAMERA_Z = 5;

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
  handleRateLimitError,
}) {
  const pointerDownPos = useRef(null);

  function handleSheepClickPosition(point) {
    const [lat, lng] = vector3ToLatLng(point, earthRadius);
    const activeSheep = sheep.find((oneSheep) => oneSheep.active);
    if (activeSheep) {
      onSetClickDestination({ id: activeSheep.id, lat, lng });
    }
  }

  function handleEarthPointerDown(event) {
    pointerDownPos.current = { x: event.clientX, y: event.clientY, point: event.point };
  }

  function handleEarthPointerUp(event) {
    if (!pointerDownPos.current) return;
    const dx = event.clientX - pointerDownPos.current.x;
    const dy = event.clientY - pointerDownPos.current.y;
    if (Math.hypot(dx, dy) < 10) {
      handleSheepClickPosition(pointerDownPos.current.point);
    }
    pointerDownPos.current = null;
  }

  const isMobile = window.innerWidth < 768;
  const cameraZ = isMobile ? MOBILE_CAMERA_Z : DESKTOP_CAMERA_Z;

  return (
    <StyledCanvas
      camera={{ position: [0, 0, cameraZ] }}
      onPointerMissed={onSetAllSheepNotActive}
    >
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
        <Earth
          onPointerDown={handleEarthPointerDown}
          onPointerUp={handleEarthPointerUp}
          isWireframe={isWireframe}
        />
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
              onRateLimitError={handleRateLimitError}
            />
          );
        })}

        <TrackballControls />
      </Suspense>
    </StyledCanvas>
  );
}
