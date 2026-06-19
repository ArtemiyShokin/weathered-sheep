import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";
import { TrackballControls } from "@react-three/drei";
import { latLngToVector3 } from "@/utils/calculationFunctions";

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

function Sheep({ latitude, longitude }) {
  const position = latLngToVector3(latitude, longitude, earthRadius);
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeScene({ sheep }) {
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
        {sheep.map((oneSheep) => (
          <Sheep
            key={oneSheep.id}
            latitude={oneSheep.position[0]}
            longitude={oneSheep.position[1]}
          />
        ))}

        <TrackballControls noZoom />
      </Canvas>
    </StyledWindowContainer>
  );
}
