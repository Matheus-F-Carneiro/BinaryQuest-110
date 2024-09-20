export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'character');
        scene.physics.world.enable(this);
        this.scene = scene;
        this.setOrigin(0, 0);
        this.gridSize = 32;
        this.isMoving = false;
        this.startX = 0;
        this.startY = 0;
        this.movementSpeed = 200;

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
        if (this.isMoving) {
            this._checkMovement();
            return;
        }

        if (this.cursors.left.isDown) {
            this._startMove(-this.gridSize, 0, 'moveleft', 'staticleft');
        } else if (this.cursors.right.isDown) {
            this._startMove(this.gridSize, 0, 'moveright', 'staticright');
        } else if (this.cursors.up.isDown) {
            this._startMove(0, -this.gridSize, 'moveup', 'staticup');
        } else if (this.cursors.down.isDown) {
            this._startMove(0, this.gridSize, 'movedown', 'staticdown');
        }
    }

    _startMove(dx, dy, moveAnim, staticAnim) {
        this.isMoving = true;
        this.startX = this.x;
        this.startY = this.y;

        this.moveDirection = staticAnim;

        this.play(moveAnim, true);

        this.setVelocity(dx === 0 ? 0 : (dx > 0 ? this.movementSpeed : -this.movementSpeed),
            dy === 0 ? 0 : (dy > 0 ? this.movementSpeed : -this.movementSpeed));
    }

    _checkMovement() {
        const distanceX = Math.abs(this.x - this.startX);
        const distanceY = Math.abs(this.y - this.startY);

        if (distanceX >= this.gridSize || distanceY >= this.gridSize) {
            this.isMoving = false;

            this.setVelocity(0, 0);

            this.x = Math.round(this.x / this.gridSize) * this.gridSize;
            this.y = Math.round(this.y / this.gridSize) * this.gridSize;

            this.play(this.moveDirection);
        }
    }

    _handleCollision(player, tile) {
        if (this.isMoving) {
            this.isMoving = false;

            this.setVelocity(0, 0);

            this.x = Math.round(this.x / this.gridSize) * this.gridSize;
            this.y = Math.round(this.y / this.gridSize) * this.gridSize;

            this.play(this.moveDirection);
        }
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

        box._startMove(dx, dy);

        return true;
    }


    _handleBoxCollision(player, box) {
        if (this.isMoving) {
            this.isMoving = false;

            this.setVelocity(0, 0);

            this.x = Math.round(this.x / this.gridSize) * this.gridSize;
            this.y = Math.round(this.y / this.gridSize) * this.gridSize;

            this.play(this.moveDirection);
            let dx = 0;
            let dy = 0;

            if (this.cursors.left.isDown) {
                dx = -this.gridSize;
            } else if (this.cursors.right.isDown) {
                dx = this.gridSize;
            } else if (this.cursors.up.isDown) {
                dy = -this.gridSize;
            } else if (this.cursors.down.isDown) {
                dy = this.gridSize;
            }

            if (dx !== 0 || dy !== 0) {
                this._tryPushBox(box, dx, dy);
            }
        }
    }

    _checkCollisionWithObstacles(targetX, targetY) {
        let isBlocked = false;

        this.scene.physics.world.collide(this.scene.boxes, this.scene.wallLayer, () => {
            isBlocked = true;
        });

        this.scene.physics.world.collide(this.scene.boxes, this.scene.floorObstacleLayer, () => {
            isBlocked = true;
        });

        return isBlocked;
    }

}