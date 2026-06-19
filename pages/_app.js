import GlobalStyle from "@/styles/styles";
import { useState, useEffect } from "react";
import { uid } from "uid";
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
        position: [50, 30],
        name: "Nephele",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: 2,
        position: [40, 20],
        name: "Nereide",
        temperature: "_",
        wind: "_",
        humidity: "_",
      },
      {
        id: 3,
        position: [33, 40],
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
          id: uid(),
          position: [45, 40],
          ...data,
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

  return (
    <>
      <GlobalStyle />
      <Component
        {...pageProps}
        sheep={sheep}
        setSheep={setSheep}
        handleFormSubmit={handleFormSubmit}
        formOpen={formOpen}
        onFormToggle={handleFormToggle}
        handleSheepDelete={handleSheepDelete}
      />
    </>
  );
}
