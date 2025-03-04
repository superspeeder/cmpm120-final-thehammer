class WorldTestScene extends Phaser.Scene {
    constructor() {
        super("worldTestScene")
    }

    create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys()
        this.sampleEnemy = new SampleEnemy(this, 400, 3.0 * game.config.height / 4.0)

        this.player = new Player(this, 100, 3.0 * game.config.height / 4.0, this.cursorKeys, [this.sampleEnemy])

        this.worldUpperLimit = this.physics.add.staticBody(0.0, 0.0, game.config.width, game.config.height / 2.0)
        this.physics.add.collider(this.player, this.worldUpperLimit)
    }

    update() {
        this.player.update()
    }
}