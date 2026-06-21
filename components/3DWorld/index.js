import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";
import { TrackballControls } from "@react-three/drei";
import { latLngToVector3 } from "@/utils/calculationFunctions";
import wanderSheep from "@/utils/animateSheep/animateSheepUpdate";
const earthRadius = 2;

function Earth(props) {
  const meshRef = useRef(null);

  //   useFrame((state, delta) => {
  //     meshRef.current.rotation.y += delta / 5;
  //   });

  return (
    <mesh {...props} ref={meshRef} scale="1">
      <sphereGeometry args={[earthRadius, 36, 36]} />
      <meshStandardMaterial wireframe />
    </mesh>
  );
}

function Sheep({ sheep, onSheepPositionUpdate }) {
  const meshRef = useRef();
  const seedRef = useRef([sheep.position[0], sheep.position[1]]);

  // Initial position
  const [x, y, z] = latLngToVector3(
    sheep.position[0],
    sheep.position[1],
    earthRadius
  );

  const positionRef = useRef([...sheep.position]);
  const velocityRef = useRef([...sheep.velocity]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // const time = state.clock.elapsedTime;

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
    // console.log(newLatitude, newLongitude);

    onSheepPositionUpdate(sheep.id, newLatitude, newLongitude, newVelocity);
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeScene({ sheep, handleSheepPositionUpdate }) {
  console.log("3D Sheep:", sheep);
  return (
    <StyledWindowContainer>
      {/* <StyledMenuBar /> */}
      <Canvas>
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
          console.log(oneSheep);
          return (
            <Sheep
              key={oneSheep.id}
              sheep={oneSheep}
              onSheepPositionUpdate={handleSheepPositionUpdate}
            />
          );
        })}

        <TrackballControls />
      </Canvas>
    </StyledWindowContainer>
  );
}
