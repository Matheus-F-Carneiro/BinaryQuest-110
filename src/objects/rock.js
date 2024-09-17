export default class Box extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);
        this.startingPos = [x, y];

        this.setTexture("box", 156);
        this.setScale(1);

        scene.add.existing(this);
    }

}