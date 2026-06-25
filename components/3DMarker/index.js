import { useRef } from "react";

export default function Marker({ position, color }) {
  const meshRef = useRef(null);
  return (
    <mesh position={position} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.07, 0.25]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
