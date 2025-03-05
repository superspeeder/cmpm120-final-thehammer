class LevelTen extends Phaser.Scene {
    constructor() {
        super('levelTenScene')
    }

    init() {}

    preload() {}

    create() {
        this.player = this.physics.add.sprite(centerX, centerY, 'animateTest')
        this.thug = this.physics.add.sprite(0, 0, 'animateTest', 0, 'left')
    }

    update() {
        // this.thug.facePlayer(this.thug.x, this.thug.direction, this.player.x)
        this.enemyFollows()
    }

    enemyFollows() {
        this.physics.moveToObject(this.thug, this.player, 100)
    }
}