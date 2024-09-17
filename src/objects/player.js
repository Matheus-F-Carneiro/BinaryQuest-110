export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.speed = 160;
        this.setTexture("character");
        this.setScale(1);

        this._createAnimations(scene);
        scene.add.existing(this);
    }

    _createAnimations(scene) {
        scene.anims.create({
            key: 'staticdown',
            frames: [{ key: 'character', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'staticright',
            frames: [{ key: 'character', frame: 8 }],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'staticup',
            frames: [{ key: 'character', frame: 12 }],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'staticleft',
            frames: [{ key: 'character', frame: 4 }],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'movedown',
            frames: scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        scene.anims.create({
            key: 'moveright',
            frames: scene.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
            frameRate: 20,
            repeat: -1
        });

        scene.anims.create({
            key: 'moveup',
            frames: scene.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
            frameRate: 20,
            repeat: -1
        });

        scene.anims.create({
            key: 'moveleft',
            frames: scene.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 20,
            repeat: -1
        });

    }

    update() {


        if (
            this.cursors.left.isDown ||
            this.cursors.right.isDown
        ) {
            if (!(this.cursors.up.isDown || this.cursors.down.isDown)) {
                if (this.cursors.left.isDown)
                    this.lastdirect = 1;
                if (this.cursors.right.isDown)
                    this.lastdirect = 3;
                this.body.setVelocityY(0);
                this.anims.play(this.cursors.left.isDown ? 'moveleft' : 'moveright', true);
                this.body.setVelocityX(this.cursors.left.isDown ? -160 : 160);
            }
            else {
                this.body.setVelocityX(this.cursors.left.isDown ? -100 : 100);
                this.lastdirect = this.cursors.left.isDown ? 3 : 1;
            }
        }
        else {
            if (!(this.cursors.up.isDown || this.cursors.down.isDown)) {
                this.body.setVelocityX(0);
            }
        }
        if (
            this.cursors.up.isDown ||
            this.cursors.down.isDown
        ) {
            this.anims.play(this.cursors.up.isDown ? 'moveup' : 'movedown', true);
            if (this.cursors.up.isDown) {
                this.lastdirect = 2;
            }
            if (this.cursors.down.isDown) {
                this.lastdirect = 0;
            }
            if (!(this.cursors.left.isDown || this.cursors.right.isDown)) {
                this.body.setVelocityX(0);
                this.body.setVelocityY(this.cursors.up.isDown ? -160 : 160);
            }
            else {
                this.body.setVelocityY(this.cursors.up.isDown ? -100 : 100);
            }
        }
        else { this.body.setVelocityY(0); }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.anims.play(this.lastdirect == 0 ? 'staticdown' : this.lastdirect == 1 ? 'staticleft' : this.lastdirect == 2 ? 'staticup' : 'staticright', true);
        }
    }
}