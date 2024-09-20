export default class Hole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'hole');
        this.filled = false;
        this.scene = scene;
        this.setOrigin(0, 0);
        this.scene.physics.world.enable(this);
        this.setImmovable(true);
    }

    _fill() {
        this.filled = true;
    }
}
