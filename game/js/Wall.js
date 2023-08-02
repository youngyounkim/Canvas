import BoundingBox from "./BoundingBox.js";
import App from "./app.js";
import { randomNumBetween } from "./utils.js";

export default class Wall {
  constructor(config) {
    this.img = document.querySelector("#wall-img");
    this.type = config.type;
    switch (this.type) {
      case "BIG":
        this.sx = this.img.width * (9 / 30);
        this.sizeX = 18 / 30;
        break;
      case "SMALL":
        this.sx = this.img.width * (0 / 30);
        this.sizeX = 9 / 30;
        break;
    }
    this.width = App.height * this.sizeX;
    this.height = App.height;

    this.gapY = randomNumBetween(App.height * 0.3, App.height * 0.4);
    this.x = App.width;
    this.y1 = -this.height + randomNumBetween(30, App.height - this.gapY - 30);
    this.y2 = this.y1 + this.height + this.gapY;

    this.generatedNext = false;
    this.gapNextX = App.width * randomNumBetween(0.7, 0.85);

    this.vx = -6;

    this.boundingBox1 = new BoundingBox(
      this.x + 30,
      this.y1 + 30,
      this.width - 60,
      this.height - 60
    );
    this.boundingBox2 = new BoundingBox(
      this.x + 30,
      this.y2 + 30,
      this.width - 60,
      this.height - 60
    );
  }
  get isOutside() {
    return this.x + this.width < 0;
  }
  get canGenerateNext() {
    return !this.generatedNext && this.x + this.width < this.gapNextX;
  }

  isColliding(target) {
    return (
      this.boundingBox1.isColliding(target) ||
      this.boundingBox2.isColliding(target)
    );
  }

  update() {
    this.x += this.vx;
    this.boundingBox1.x = this.boundingBox2.x = this.x + 30;
  }
  draw() {
    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y1,
      this.width,
      this.height
    );
    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y2,
      this.width,
      this.height
    );
    // this.boundingBox1.draw();
    // this.boundingBox2.draw();
  }
}
