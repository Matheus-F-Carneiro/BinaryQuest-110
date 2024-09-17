export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'character');
        scene.physics.world.enable(this);
        this.setOrigin(0, 0);
        this.scene = scene;
        
        this.gridSize = 32;
        this.isMoving = false;
        this.moveDirection = null;

        this._createAnimations(scene); 

        this.cursors = scene.input.keyboard.createCursorKeys();
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
        if (this.isMoving) return;

        if (this.cursors.left.isDown) {
            this._move(-this.gridSize, 0, 'moveleft', 'staticleft');
        } else if (this.cursors.right.isDown) {
            this._move(this.gridSize, 0, 'moveright', 'staticright');
        } else if (this.cursors.up.isDown) {
            this._move(0, -this.gridSize, 'moveup', 'staticup');
        } else if (this.cursors.down.isDown) {
            this._move(0, this.gridSize, 'movedown', 'staticdown');
        }
    }

    _move(dx, dy, moveAnim, staticAnim) {
        const targetX = this.x + dx;
        const targetY = this.y + dy;

        let box = this._checkForBox(targetX, targetY);
        if (box && !this._tryPushBox(box, dx, dy)) return;

        this.isMoving = true;
        this.moveDirection = staticAnim;

        this.play(moveAnim, true);

        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200,
            onComplete: () => {
                this.isMoving = false;
                this.play(staticAnim);
            }
        });
    }

    _checkForBox(targetX, targetY) {
        let box = null;
        this.scene.boxes.getChildren().forEach((b) => {
            if (Phaser.Math.Fuzzy.Equal(b.x, targetX, 1) && Phaser.Math.Fuzzy.Equal(b.y, targetY, 1)) {
                box = b;
            }
        });
        return box;
    }

    _tryPushBox(box, dx, dy) {
        const targetX = box.x + dx;
        const targetY = box.y + dy;

        const blocked = this._checkCollisionWithObstacles(targetX, targetY);
        if (blocked) return false;

        this.scene.tweens.add({
            targets: box,
            x: targetX,
            y: targetY,
            duration: 200,
        });

        return true;
    }

    _checkCollisionWithObstacles(targetX, targetY) {
        let isBlocked = false;

        const tileAtTarget = this.scene.groundLayer.getTileAtWorldXY(targetX, targetY) || 
                             this.scene.wallLayer.getTileAtWorldXY(targetX, targetY);
        
        if (tileAtTarget && tileAtTarget.properties.collides) {
            isBlocked = true;
        }
        this.scene.boxes.getChildren().forEach((box) => {
            if (Phaser.Math.Fuzzy.Equal(box.x, targetX, 1) && Phaser.Math.Fuzzy.Equal(box.y, targetY, 1)) {
                isBlocked = true;
            }
        });

        return isBlocked;
    }
}