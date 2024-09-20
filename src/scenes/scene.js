import Player from "../objects/player.js";
import Box from "../objects/box.js";
import Hole from "../objects/hole.js";

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FirstScene' });
    }

    preload() {
        this.load.spritesheet('character', "assets/maincharacter/robo.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('tileset', "assets/background/terrain_atlas.png");
        this.load.image('box', "assets/entities/box.png");
        this.load.image('hole', "assets/entities/hole.png");
        this.load.tilemapTiledJSON('map', "assets/themap.json");
    }

    create() {

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('terrain_atlas', 'tileset');



        const groundLayer = map.createStaticLayer('GroundLayer', tileset);
        const topGroundLayer = map.createStaticLayer('TopGroundLayer', tileset);
        const aestheticGroundLayer = map.createStaticLayer('AestheticGroundLayer', tileset);
        const floorObstacleLayer = map.createStaticLayer('FloorObstacleLayer', tileset);
        const wallLayer = map.createStaticLayer('WallLayer', tileset);


        floorObstacleLayer.setCollisionByProperty({ collide: true });
        wallLayer.setCollisionByProperty({ collide: true });

        const objectLayer = map.getObjectLayer('InteractiveObjectLayer');
        let playerStart = objectLayer.objects.find(obj => obj.type === 'player');
        this.player = new Player(this, playerStart.x, playerStart.y);

        this.add.existing(this.player);

        this.boxes = this.physics.add.group();
        this.holes = this.add.group();
        const tallObstacleLayer = map.createStaticLayer('TallObstacleLayer', tileset);

        objectLayer.objects.forEach(obj => {
            if (obj.type === 'box') {
                const box = new Box(this, obj.x, obj.y);
                this.add.existing(box);  // Add the box to the scene
                this.boxes.add(box);
            } else if (obj.type === 'hole') {
                const hole = new Hole(this, obj.x, obj.y);
                this.add.existing(hole);  // Add the hole to the scene
                this.holes.add(hole);
            }
        });


        this.cameras.main.startFollow(this.player);
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        this.boxes.setDepth(2); // Higher value brings the box to the front
        this.holes.setDepth(2);
        tallObstacleLayer.setDepth(3);

        // Enable collisions between the player and obstacles
        // Enable collisions between the player and obstacles
        this.physics.add.collider(this.player, floorObstacleLayer, this.player._handleCollision, null, this.player);
        this.physics.add.collider(this.player, wallLayer, this.player._handleCollision, null, this.player);
        this.physics.add.collider(this.player, this.holes, this.player._handleCollision, null, this.player);
        this.physics.add.collider(this.player, this.boxes, this.player._handleBoxCollision, null, this.player);

        this.physics.add.collider(this.boxes, floorObstacleLayer);
        this.physics.add.collider(this.boxes, wallLayer);
        this.physics.add.overlap(this.boxes, this.holes, this._handleBoxHoleCollision, null, this);

    }

    update(time, delta) {
        this.player.update(this.cursors);

        this.boxes.getChildren().forEach(box => {
            box._updateMovement();
        });
    }

    _handleBoxHoleCollision(box, hole) {
        if (!hole.filled) {
            hole.destroy();
            box.destroy();
        }
    }
}