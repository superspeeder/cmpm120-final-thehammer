class LevelTen extends Phaser.Scene {
    constructor() {
        super('levelTenScene')
    }

    init() {}

    preload() {}

    create() {
        this.player = this.add.rectangle(centerX, centerY, 10, 10, 0xffffff)

        this.enemies = this.add.group()
        this.thug = new Thug(this, 0, 0, 'animateTest', this.player)
        this.enemies.add(this.thug)
    }

    update() {
        // step(update) state machines
        this.thugFSM.step()
    }

    enemyFollows() {
        this.physics.moveToObject(this.thug, this.player, 100)
    }
}