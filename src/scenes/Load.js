class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // TODO: load assets
        this.load.image("playerSprite", "assets/textures/playerSprite.png")
        this.load.image("sampleEnemySprite", "assets/textures/sampleEnemySprite.png")
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