import { createGlobalStyle } from "styled-components";
import { reset } from "./reset";
import { Archivo_Black } from "next/font/google";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  fontStyle: "normal",
});

const GlobalStyle = createGlobalStyle`
  ${reset}

:root {
  background-color: var(--support);
  color: var(--hero);

  /* COLORS */
  --hero: #A7E6BF;
  --accent: #004ddb;
  --support: #595959;

  --text-font-family: ${archivo.style.fontFamily};
}

body {
  font-family:var(--text-font-family);
}
`;

export default GlobalStyle;
