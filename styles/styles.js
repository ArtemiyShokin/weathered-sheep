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
  background-color: var(--support);
  color: var(--hero);

  /* COLORS */
  --hero: #90EE90;
  --accent: #004ddb;
  --support: #505050;

  --text-font-family: ${archivo.style.fontFamily};
  --roboto-font: ${roboto.style.fontFamily}
}

body {
  font-family:var(--text-font-family);
}
`;

export default GlobalStyle;
