class SampleEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sampleEnemySprite")

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setOrigin(0.5, 1.0)

        this.body.setImmovable(true)
        this.body.setSize(this.width, 30).setOffset(0.0, this.height - 30.0)
    }
}