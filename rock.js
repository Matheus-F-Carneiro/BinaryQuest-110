export default class Rock extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y);
    
    this.setTexture("rock", 156);
    this.setScale(1);
    scene.add.existing(this);
  }

  
  
}