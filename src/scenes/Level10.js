class Level10 extends Phaser.Scene {
    constructor() {
        super('level10')
    }

    create() {
        this.worldBackground = this.add.image(0, 0, "level10").setOrigin(0, 0).setDepth(-100)

        this.cursorKeys = this.input.keyboard.createCursorKeys()
        this.sampleEnemy = new SampleEnemy(this, 400, 3.0 * game.config.height / 4.0).setScale(1.5)

        this.rock1 = new Rock(this, 95, 889)
        this.rock2 = new Rock(this, 221, 631)
        this.rock3 = new Rock(this, 923, 790)

        this.player = new Player(this, 100, 3.0 * game.config.height / 4.0, this.cursorKeys, [this.sampleEnemy, this.rock1, this.rock2, this.rock3]).setScale(1.5)

        this.worldUpperLimit = this.physics.add.staticBody(0.0, 0.0, game.config.width, game.config.height / 2.0)
        this.physics.add.collider(this.player, this.worldUpperLimit)
    }

    update() {
        this.player.update()
    }
}