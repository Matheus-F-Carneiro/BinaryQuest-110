import FirstScene from "./scene.js";

// https://dev.to/ceceliacreates/building-a-mobile-game-with-phaser-and-ionic-vue-building-a-phaser-game-2f74#adding-game-objects
// https://shakuro.com/blog/phaser-js-a-step-by-step-tutorial-on-making-a-phaser-3-game#part-3

const config = {
  type: Phaser.AUTO,
  width: 11 * 32,
  height: 11 * 32,
  parent: 'game-container',
  backgroundColor: "#f9f9f9",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },
      debug: false,
    },
  },
  scene: [FirstScene]
};

const game = new Phaser.Game(config);