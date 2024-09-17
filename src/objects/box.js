export default class Box extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        scene.physics.world.enable(this);
        this.setOrigin(0, 0);
        this.setImmovable(true);
        this.scene = scene;
    }

}
