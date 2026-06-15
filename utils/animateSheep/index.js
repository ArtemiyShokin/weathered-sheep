import sheepSound from "../sheepSound";
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
          `/api/open-meteo?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) {
          console.error(`Weather fetch failed: ${response.status}`);
          return;
        }
        const weather = await response.json();
        setSheep((prevSheep) =>
          prevSheep.map((oneSheep) =>
            oneSheep.id === sheepId
              ? {
                  ...oneSheep,
                  temperature: weather.current.temperature_2m,
                  wind: weather.current.wind_speed_10m,
                  humidity: weather.current.relative_humidity_2m,
                }
              : oneSheep
          )
        );
      }
      startFetching(targetLatitude, targetLongitude);
      sheepSound();
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
