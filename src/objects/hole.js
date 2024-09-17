export default class Hole extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'hole');
        this.filled = false;
        this.scene = scene;
        this.setOrigin(0, 0);
    } 

    fill() {
        this.filled = true;
    }
}
