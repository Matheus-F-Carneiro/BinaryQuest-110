import Player from "../objects/player.js";
import Box from "../objects/box.js";
import Hole from "../objects/hole.js";

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FirstScene' });
    }
    
    preload() {
        this.load.image("tileset", "assets/background/terrain.png");
        this.load.spritesheet("rock", "assets/background/terrain.png", { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet("character", "assets/maincharacter/robo.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image("othertiles", "assets/background/terrain_atlas.png")
    }

    create() {
        const sand = 307;
        const invis = 743;
        const level = [
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand],
            [sand, sand, sand, sand, sand, sand, sand, sand, sand, sand, sand]
        ];
        
        const map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
        const tiles = map.addTilesetImage("tileset");
        const layer = map.createDynamicLayer(0, tiles, 0, 0);
        const walls = [
            [217, 345, 345, 345, 345, 345, 345, 345, 345, 345, 218],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312],
            [314, invis, invis, invis, invis, invis, invis, invis, invis, invis, 312]
        ]
        const wallmap = this.make.tilemap({ data: walls, tileWidth: 32, tileHeight: 32 })
        const walltiles = wallmap.addTilesetImage("othertiles");
        const walllayer = wallmap.createDynamicLayer(0, walltiles, 0, 0);
        
        this.player = new Player(this, 192, 320, this);
        const play = this.physics.add.existing(this.player);
        play.body.setCollideWorldBounds(true);

        this.player.setDepth(2);
        
        this.holes = [];
        this.rocks = [];
        for (let i = 0; i < 3; i++) {
            this.holes.push(new Hole(this, 64 + (i * 128), 96, this));
            const hole = this.physics.add.existing(this.holes[i]);
            hole.body.setImmovable(true);
        
            this.rocks.push(new Rock(this, 64 + (i * 128), 256, this));
            const rocker = this.physics.add.existing(this.rocks[i]);
            rocker.body.setCollideWorldBounds(true);
            rocker.body.pushable = false;
        
            this.physics.add.collider(this.player, this.rocks[i]);
            this.physics.add.collider(this.player, this.holes[i]);
        }   
        
        walllayer.setCollision([217, 345, 218, 314, 312]);
        this.physics.add.collider(this.player, walllayer);
        this.rocks.forEach(rock => this.physics.add.collider(rock, walllayer));

        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
        
    }

    update() {
        this.player.update();

        for (let i = 0; i < this.rocks.length; i++) {
            if (this.rocks[i].active) {
                this.rocks[i]._pushed(this.player);

                for (let j = 0; j < this.holes.length; j++) {
                    if (this.rocks[i]._fall(this.holes[j])) {
                        const x = this.holes[j].x - 32;
                        const y = this.holes[j].y - 32;

                        this.rocks[i].destroy();
                        this.holes[j].destroy();

                        this.rocks.splice(i, 1);
                        this.holes.splice(j, 1);

                        const rocks = [
                            [632, 633],
                            [664, 665]
                        ];
                        const rockMap = this.make.tilemap({ data: rocks, tileWidth: 32, tileHeight: 32 });
                        const tiles = rockMap.addTilesetImage("tileset");
                        const rockLayer = rockMap.createDynamicLayer(0, tiles, x, y);
                        rockLayer.setDepth(1);

                        break;
                    }
                }
            }
        }
    }

    
}