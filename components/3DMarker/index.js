import { useRef } from "react";

export default function Marker({ position, color }) {
  const meshRef = useRef(null);
  return (
    <mesh position={position} rotation={[Math.PI, 0, 0]} scale={[1, 1.5, 1]}>
      <sphereGeometry args={[0.07, 8, 2]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
