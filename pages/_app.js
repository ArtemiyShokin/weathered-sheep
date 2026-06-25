import GlobalStyle from "@/styles/styles";
import { useState, useEffect } from "react";
import { uid } from "uid";
import useLocalStorageState from "use-local-storage-state";
import { randomPositionNoBounds } from "@/utils/calculationFunctions";
import { initalColors } from "@/utils/MapData";

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [soundVersion, setSoundVersion] = useState("mp3");
  const [colors, setColors] = useState(initalColors);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [sheep, setSheep] = useLocalStorageState("sheep", {
    defaultValue: [
      {
        id: "1",
        position: [50, -30],
        color: "#CB3772",
        infoPosition: [0, 0],
        velocity: [0.1, 0.1],
        name: "Nephele",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: "2",
        position: [90, 0],
        color: "#FFBD34",
        infoPosition: [0, 0],
        velocity: [0.1, 0.1],
        name: "Nereide",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: "3",
        position: [0, 40],
        color: "#85C87B",
        infoPosition: [0, 0],
        velocity: [0.1, 0.1],
        name: "Hyade",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
    ],
  });

  if (!mounted) {
    return null;
  }

  function handleFormSubmit(data) {
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];
    setSheep((prevSheep) => {
      if (prevSheep.length >= 9) return prevSheep;
      const [latitude, longitude] = randomPositionNoBounds();
      return [
        ...prevSheep,
        {
          ...data,
          id: uid(),
          position: [latitude, longitude],
          color: pickedColor,
          infoPosition: [0, 0],
          velocity: [0.1, 0.1],
          temperature: "_",
          wind: "_",
          humidity: "_",
        },
      ];
    });
    setColors((prevColors) =>
      prevColors.filter((color) => color !== pickedColor)
    );
    setFormOpen(false);
  }
  function handleFormToggle() {
    setFormOpen(!formOpen);
  }

  function handleSheepDelete(sheepId) {
    const sheepToDelete = sheep.find((oneSheep) => oneSheep.id === sheepId);
    setSheep((prevSheep) =>
      prevSheep.filter((oneSheep) => oneSheep.id !== sheepId)
    );
    setColors([...colors, sheepToDelete.color]);
  }

  function handleSheepPositionUpdate(
    sheepId,
    newLatitude,
    newLongitude,
    newVelocity
  ) {
    setSheep((prevSheep) =>
      prevSheep.map((oneSheep) =>
        oneSheep.id === sheepId
          ? {
              ...oneSheep,
              position: [newLatitude, newLongitude],
              infoPosition: [newLatitude, newLongitude],
              velocity: newVelocity,
            }
          : oneSheep
      )
    );
  }

  function handleSheepWeatherUpdate(
    sheepId,
    currentTemperature,
    currentWind,
    currentHumidity
  ) {
    setSheep((prevSheep) =>
      prevSheep.map((oneSheep) =>
        oneSheep.id === sheepId
          ? {
              ...oneSheep,
              temperature: currentTemperature,
              wind: currentWind,
              humidity: currentHumidity,
            }
          : oneSheep
      )
    );
  }
  function handleSoundVersionToggle(version) {
    setSoundVersion(version);
  }

  return (
    <>
      <GlobalStyle />
      <Component
        {...pageProps}
        sheep={sheep}
        handleSheepPositionUpdate={handleSheepPositionUpdate}
        handleSheepWeatherUpdate={handleSheepWeatherUpdate}
        setSheep={setSheep}
        handleFormSubmit={handleFormSubmit}
        formOpen={formOpen}
        onFormToggle={handleFormToggle}
        handleSheepDelete={handleSheepDelete}
        onSoundVersionToggle={handleSoundVersionToggle}
        soundVersion={soundVersion}
      />
    </>
  );
}
