import GlobalStyle from "@/styles/styles";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [sheep, setSheep] = useState([
    {
      id: 1,
      position: [50, 30],
      name: "🐑 Nephele",
      weatherLocation: "nah",
      temperature: "_",
      wind: "_",
      humidity: "_",
    },
    {
      id: 2,
      position: [40, 20],
      name: "🐑 Nereide",
      weatherLocation: "nah",
      temperature: "_",
      wind: "_",
      humidity: "_",
    },
    {
      id: 3,
      position: [33, 40],
      name: "🐑 Hyade",
      weatherLocation: "nah",
      temperature: "_",
      wind: "_",
      humidity: "_",
    },
  ]);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} sheep={sheep} setSheep={setSheep} />
    </>
  );
}
