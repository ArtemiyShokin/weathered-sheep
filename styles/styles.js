import { createGlobalStyle } from "styled-components";
import { reset } from "./reset";
import { Archivo_Black, Roboto_Mono } from "next/font/google";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  fontStyle: "normal",
});
const roboto = Roboto_Mono({ subsets: ["latin"] });

const GlobalStyle = createGlobalStyle`
  ${reset}

:root {
  background-color: var(--huemint1);

  color: var(--huemint2);
  background-image: url(/assets/image-assets/noisy.png);
  background-blend-mode: soft-light;


  /* COLORS */

  /* --huemint1: #1e2238; */
    --huemint1: #6f5070;
  --huemint2: #f9ca63;
  --huemint3: #e9e8ce;
  --huemint4: #e64f1b;
  --huemint4-lighter: hsl(7, 79%, 80%);
  --huemint1-lighter: hsl(231, 30%, 27%);


  --text-font-family: ${archivo.style.fontFamily};
  --roboto-font: ${roboto.style.fontFamily}
}

body {
  font-family:var(--text-font-family);
}
`;

export default GlobalStyle;
