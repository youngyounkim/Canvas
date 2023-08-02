import App from "./js/app.js";

const app = new App();

window.addEventListener("load", () => {
  app.resize();
  app.render();
});
