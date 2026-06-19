import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";
import { TrackballControls } from "@react-three/drei";

// function Box(props) {
//   const meshRef = useRef(null);
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   useFrame((state, delta) => (meshRef.current.rotation.y += delta));
//   useFrame((state, delta) => (meshRef.current.rotation.x += delta));
//   return (
//     <mesh
//       {...props}
//       ref={meshRef}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }

function Earth(props) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta / 5;
  });

  return (
    <mesh {...props} ref={meshRef} scale="1">
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial wireframe />
    </mesh>
  );
}

export default function ThreeScene() {
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
        <TrackballControls noZoom />
      </Canvas>
    </StyledWindowContainer>
  );
}
