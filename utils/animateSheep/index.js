export default function animateTo(
  sheepId,
  sheepRef,
  animationRefs,
  setSheep,
  targetLat,
  targetLng,
  animationDuration
) {
  const currentSheep = sheepRef.current.find((sheep) => sheep.id === sheepId);

  if (!currentSheep) return;

  if (animationRefs.current[sheepId]) {
    cancelAnimationFrame(animationRefs.current[sheepId]);
  }

  const startLat = currentSheep.position[0];
  const startLng = currentSheep.position[1];

  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / animationDuration, 1);

    const newLat = startLat + (targetLat - startLat) * t;

    const newLng = startLng + (targetLng - startLng) * t;

    setSheep((prevSheep) =>
      prevSheep.map((sheep) =>
        sheep.id === sheepId
          ? {
              ...sheep,
              position: [newLat, newLng],
            }
          : sheep
      )
    );

    if (t < 1) {
      animationRefs.current[sheepId] = requestAnimationFrame(step);
    }
  }

  animationRefs.current[sheepId] = requestAnimationFrame(step);
}
