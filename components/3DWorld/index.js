import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";
import { TrackballControls, Html, useProgress } from "@react-three/drei";
import Sheep from "@/components/3DSheep";
import { StyledCanvas } from "./3DWorld.styled";
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
}) {
  return (
    <StyledCanvas>
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
        <Earth />
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
            />
          );
        })}

        <TrackballControls />
      </Suspense>
    </StyledCanvas>
  );
}
