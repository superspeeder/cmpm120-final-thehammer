class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // TODO: load assets
        this.load.aseprite("playerSprite", "assets/textures/player1.png", "assets/textures/player1.json")
        this.load.image("sampleEnemySprite", "assets/textures/sampleEnemySprite.png")
        
    }

    create() {
        // TODO: load main menu scene from here
        this.anims.createFromAseprite("playerSprite", ["IdleLeft", "IdleRight", "WalkLeft", "WalkRight", "PunchLeft", "PunchRight"])

        this.anims.get("WalkLeft").repeat = -1;
        this.anims.get("WalkRight").repeat = -1;

        console.log("Hello!");
        this.scene.switch("worldTestScene")
    }

    update() {
        // is this necessary? I don't remember
    }
}