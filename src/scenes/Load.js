class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // TODO: load assets
        // this.load.image("playerSprite", "assets/textures/playerSprite.png")
        this.load.aseprite("playerSprite", "assets/textures/player1.png", "assets/textures/player1.json")
        this.load.image("sampleEnemySprite", "assets/textures/sampleEnemySprite.png")

        this.anims.createFromAseprite("playerSprite")
    }

    create() {
        // TODO: load main menu scene from here

        console.log("Hello!");
        this.scene.switch("worldTestScene")
    }

    update() {
        // is this necessary? I don't remember
    }
}