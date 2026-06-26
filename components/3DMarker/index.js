export default function Marker({ position, color, active }) {
  return (
    <mesh
      position={position}
      rotation={[Math.PI, 0, 0]}
      scale={active ? [1.5, 2, 1.5] : [1, 1.5, 1]}
    >
      <sphereGeometry args={[0.07, 8, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={active ? "var(--huemint4)" : null}
        emissiveIntensity={active ? 6 : null}
      />
    </mesh>
  );
}
