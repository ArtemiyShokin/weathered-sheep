import React, { Suspense, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { TrackballControls, Html, useProgress } from "@react-three/drei";
import Sheep from "@/components/3DSheep";
import { StyledCanvas } from "./3DWorld.styled";
import { vector3ToLatLng } from "@/utils/calculationFunctions";

export const earthRadius = 2;

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

function Earth(props) {
  const meshRef = useRef(null);

  return (
    <mesh {...props} ref={meshRef} scale="1">
      <sphereGeometry args={[earthRadius, 18, 18]} />
      <meshStandardMaterial color={"orange"} wireframe />
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
        <Earth onClick={handleSheepClickPosition} />
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
