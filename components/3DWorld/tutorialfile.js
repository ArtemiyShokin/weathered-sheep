import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";

function Box(props) {
  const meshRef = useRef(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.y += delta));
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Boxes() {
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
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </StyledWindowContainer>
  );
}
