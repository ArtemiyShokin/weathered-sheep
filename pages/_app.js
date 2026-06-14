import GlobalStyle from "@/styles/styles";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [sheep, setSheep] = useState([
    {
      id: 1,
      position: [50, 30],
      name: "Storm",
      weatherLocation: "nah",
      temperature: "uh",
    },
    {
      id: 2,
      position: [40, 20],
      name: "Pinky",
      weatherLocation: "nah",
      temperature: "uh",
    },
    {
      id: 3,
      position: [33, 40],
      name: "Jezebel",
      weatherLocation: "nah",
      temperature: "uh",
    },
  ]);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} sheep={sheep} setSheep={setSheep} />
    </>
  );
}
