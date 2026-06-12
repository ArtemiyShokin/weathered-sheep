export default function animateSheep(
  sheepId,
  sheepRef,
  animationRefs,
  setSheep,
  targetLatitude,
  targetLongitude,
  animationDuration
) {
  const currentSheep = sheepRef.current.find((sheep) => sheep.id === sheepId);

  if (!currentSheep) return;

  if (animationRefs.current[sheepId]) {
    cancelAnimationFrame(animationRefs.current[sheepId]);
  }

  const startLatitude = currentSheep.position[0];
  const startLongitude = currentSheep.position[1];

  const startTime = performance.now();

  function step(now) {
    const animationProgress = Math.min(
      (now - startTime) / animationDuration,
      1
    );

    const newLat =
      startLatitude + (targetLatitude - startLatitude) * animationProgress;

    const newLng =
      startLongitude + (targetLongitude - startLongitude) * animationProgress;

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

    if (animationProgress < 1) {
      animationRefs.current[sheepId] = requestAnimationFrame(step);
    }
  }

  animationRefs.current[sheepId] = requestAnimationFrame(step);
}
