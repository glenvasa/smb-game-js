import platform from "../images/platform.png";
import hills from "../images/hills.png";
import background from "../images/background.png";

const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

// changed from window innerwidth/height to 16:9 aspect ratio for better responsivity
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

// creates new Image HTML object
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = createImage(platform);

let player = new Player();

let platforms = [
  new Platform({
    x: -1,
    y: 470,
    image: platformImage,
  }),
  new Platform({
    x: platformImage.width - 3,
    y: 470,
    image: platformImage,
  }),
  new Platform({
    x: platformImage.width * 2 + 100,
    y: 470,
    image: platformImage,
  }),
];

let genericObjects = [
  new GenericObject({
    x: -1,
    y: -1,
    image: createImage(background),
  }),
  new GenericObject({
    x: -1,
    y: -1,
    image: createImage(hills),
  }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

// tracking platform scrolling
let scrollOffset = 0;

function init() {
  platformImage = createImage(platform);

  player = new Player();

  platforms = [
    new Platform({
      x: -1,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width - 3,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];

  // tracking platform scrolling
  scrollOffset = 0;
}

function animate() {
  //creates recursive animation loop
  requestAnimationFrame(animate);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((obj) => {
    obj.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  // draw player after platforms drawn, so player is always visible
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    // this is the point where we either move player to the max left or right, player actually stops moving and then
    // platforms/background moves to give illusion that player still moving
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObjects.forEach((obj) => {
        obj.position.x -= 3;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      genericObjects.forEach((obj) => {
        obj.position.x += 3;
      });
    }
  }

  // rectangular collision detection (player/platform)
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // win condition
  if (scrollOffset === 2000) {
    console.log("You win");
  }

  // lose condition

  if (player.position.y > canvas.height) {
    console.log("You lose");
    init();
  }
}

animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65: // 'a' left
      keys.left.pressed = true;
      break;
    case 83: // 's' down
      break;
    case 68: // 'd' right
      keys.right.pressed = true;
      break;
    case 87: // 'w' up
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65: // 'a' left
      keys.left.pressed = false;
      break;
    case 83: // 's' down
      break;
    case 68: // 'd' right
      keys.right.pressed = false;
      break;
    case 87: // 'w' up
      // player.velocity.y -= 20
      break;
  }
});
