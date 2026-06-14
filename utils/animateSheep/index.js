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

    if (animationProgress >= 1) {
      async function startFetching(latitude, longitude) {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
        );
        const weather = await response.json();
        console.dir(weather);
        setSheep((prevSheep) =>
          prevSheep.map((oneSheep) =>
            oneSheep.id === sheepId
              ? {
                  ...oneSheep,
                  temperature: weather.current.temperature_2m,
                }
              : oneSheep
          )
        );
      }
      startFetching(targetLatitude, targetLongitude);
    }

    setSheep((prevSheep) =>
      prevSheep.map((oneSheep) =>
        oneSheep.id === sheepId
          ? {
              ...oneSheep,
              position: [newLat, newLng],
            }
          : oneSheep
      )
    );

    if (animationProgress < 1) {
      animationRefs.current[sheepId] = requestAnimationFrame(step);
    }
  }

  animationRefs.current[sheepId] = requestAnimationFrame(step);
}
