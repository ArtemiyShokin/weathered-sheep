import { animated, useSpring } from "@react-spring/three";

export default function Marker({ position, color, active }) {
  const springs = useSpring({ scale: active ? [1.5, 2, 1.5] : [1, 1.5, 1] });
  return (
    <animated.mesh
      position={position}
      rotation={[Math.PI, 0, 0]}
      scale={springs.scale}
    >
      <sphereGeometry args={[0.07, 8, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={active ? "lightgreen" : null}
        emissiveIntensity={active ? 1.6 : null}
      />
    </animated.mesh>
  );
}
