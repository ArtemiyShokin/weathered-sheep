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

  /* COLORS */
  /* --hero: #90EE90; */
  /* --accent: #404744; */
  /* --support: #0d0f0e; */

  /* --huemint1: #0d0f0e;
  --huemint2: #66cb1d;
  --huemint3: #009d01;
  --huemint4: #e95947;
  --huemint4-lighter: hsl(7, 79%, 80%); */

  --huemint1: #1e2238;
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
