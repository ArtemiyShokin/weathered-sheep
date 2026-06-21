import GlobalStyle from "@/styles/styles";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { customAlphabet } from "nanoid";
import useLocalStorageState from "use-local-storage-state";

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [sheep, setSheep] = useLocalStorageState("sheep", {
    defaultValue: [
      {
        id: 1,
        position: [50, -30],
        infoPosition: [0, 0],
        velocity: [0.1, 0.1],
        name: "Nephele",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: 2,
        position: [40, 20],
        infoPosition: [0, 0],
        velocity: [0.1, 0.1],
        name: "Nereide",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: 3,
        position: [0, 40],
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
    setSheep((prevSheep) => {
      if (prevSheep.length >= 9) return prevSheep;
      return [
        ...prevSheep,
        {
          ...data,
          id: customAlphabet("0123456789", 12),
          position: [10, 10],
          infoPosition: [0, 0],
          velocity: [0.1, 0.1],
          temperature: "_",
          wind: "_",
          humidity: "_",
        },
      ];
    });
    setFormOpen(false);
  }
  function handleFormToggle() {
    setFormOpen(!formOpen);
  }

  function handleSheepDelete(sheepId) {
    setSheep((prevSheep) =>
      prevSheep.filter((oneSheep) => oneSheep.id !== sheepId)
    );
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
              infoPosition: [newLatitude, newLongitude],
              velocity: newVelocity,
            }
          : oneSheep
      )
    );
  }

  return (
    <>
      <GlobalStyle />
      <Component
        {...pageProps}
        sheep={sheep}
        handleSheepPositionUpdate={handleSheepPositionUpdate}
        setSheep={setSheep}
        handleFormSubmit={handleFormSubmit}
        formOpen={formOpen}
        onFormToggle={handleFormToggle}
        handleSheepDelete={handleSheepDelete}
      />
    </>
  );
}
