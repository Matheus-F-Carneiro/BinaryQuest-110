import Player from "./player.js";
import Rock from "./rock.js";


export default class FirstScene extends Phaser.Scene {
    preload() {
            this.load.spritesheet("maidNPC", "assets/entities/maidbot.png", { frameWidth: 32, frameHeight: 32 });
            this.load.image("tileset", "assets/background/terrain.png");
            this.load.spritesheet("rock", "assets/background/terrain.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("character", "assets/maincharacter/robo.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        const sand = 307

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

        
        this.player = new Player(this, 264, 250, this);
        const play = this.physics.add.existing(this.player);
        play.body.setCollideWorldBounds(true);

        this.rock = new Rock(this, 200, 200, this);
        const rocker = this.physics.add.existing(this.rock);
        rocker.body.setCollideWorldBounds(true);
        rocker.body.setDrag(10000);
        this.physics.add.collider(this.player, this.rock);
        
        this.maid_npc = this.physics.add.staticSprite(32, 32, "maidNPC", 1);
        
        this.physics.add.collider(this.player, this.maid_npc);
        this.physics.add.collider(this.maid_npc, this.rock);
        
        this.anims.create({
            key: 'maididle',
            frames: this.anims.generateFrameNumbers("maidNPC", { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        })
    }

    update() {
        this.player.update();
        this.maid_npc.anims.play('maididle', true);
    }
}