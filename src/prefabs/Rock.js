class Rock extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y) {
        super(scene, x, y, "rock")
        
        scene.physics.add.existing(this)
        scene.add.existing(this)

        this.setOrigin(0.5, 1.0)


        this.body.setSize(106, 36).setOffset(9, this.height - 36)
        this.body.setImmovable(true)
    }
}