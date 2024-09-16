export default class Rock extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);
        this.startingPos = [x, y];

        this.setTexture("rock", 156);
        this.setScale(1);

        scene.add.existing(this);
    }
    
    _pushed(player) {
        if (this.body.touching.right && player.body.touching.left) {
            if (this.x >= this.startingPos[0] - 32)
                this.body.setVelocityX(-260);
        }
        if (this.x <= this.startingPos[0] - 32) {
            this.body.setVelocityX(0);
            this.startingPos[0] = this.x;
            console.log(this.startingPos);
        }
        if (this.body.touching.left && player.body.touching.right) {
            if (this.x <= this.startingPos[0] + 32)
                this.body.setVelocityX(260);
        }
        if(this.x >= this.startingPos[0] + 32){
            this.body.setVelocityX(0);
            this.startingPos[0] = this.x;
            console.log(this.startingPos);
        }
        if (this.body.touching.down && player.body.touching.up) {
            if (this.y >= this.startingPos[1] - 32)
                this.body.setVelocityY(-260);
        }
        if (this.y <= this.startingPos[1] - 32){
            this.body.setVelocityY(0);
            this.startingPos[1] = this.y;
            console.log(this.startingPos);
        }
        if (this.body.touching.up && player.body.touching.down) {
            if (this.y <= this.startingPos[1] + 32)
                this.body.setVelocityY(260);
        }
        if(this.y >= this.startingPos[1] + 32){
            this.body.setVelocityY(0);
            this.startingPos[1] = this.y;
            console.log(this.startingPos);
        }
        
    }

    _fall(hole){
        if (this.x >= hole.x - 32 && this.x <= hole.x + 32 && this.y >= hole.y - 32 && this.y <= hole.y + 32)
            return true;
    }
}