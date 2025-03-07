// The Hammer prefab
// (The Hammer is the final boss)
class Hammer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)    // add The Hammer to existing scene
        scene.physics.add.existing(this)    // add physics body to scene

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
    }
}