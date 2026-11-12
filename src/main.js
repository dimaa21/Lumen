import "./styles.css";
import "lenis/dist/lenis.css";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import { initPage } from "./animations.js";

document.documentElement.style.setProperty(
  "--noise",
  `url("${import.meta.env.BASE_URL}noise.png")`,
);

initPage();
