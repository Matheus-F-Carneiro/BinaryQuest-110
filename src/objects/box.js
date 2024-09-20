export default class Box extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        this.scene = scene;
        this.gridSize = 32;
        this.isMoving = false;
        this.startX = 0;
        this.startY = 0;

        this.scene.physics.world.enable(this);
        
        this.setImmovable(true);
        
        this.setOrigin(0, 0);
    }
    
    _startMove(dx, dy) {
        if (this.isMoving) return; 

        this.isMoving = true;
        this.startX = this.x;
        this.startY = this.y;

        this.setVelocity(dx === 0 ? 0 : (dx > 0 ? this.scene.player.movementSpeed : -this.scene.player.movementSpeed),
            dy === 0 ? 0 : (dy > 0 ? this.scene.player.movementSpeed : -this.scene.player.movementSpeed));
    }

    _updateMovement() {
        if (!this.isMoving) return;

        const distanceX = Math.abs(this.x - this.startX);
        const distanceY = Math.abs(this.y - this.startY);

        if (distanceX >= this.gridSize || distanceY >= this.gridSize) {
            this.setVelocity(0, 0);
            this.x = Math.round(this.x / this.gridSize) * this.gridSize;
            this.y = Math.round(this.y / this.gridSize) * this.gridSize;

            this.isMoving = false;
            this.setImmovable(true);
        }
    }
}
