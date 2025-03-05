// Toggle prefab
class Toggle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureOn, textureOff, state = false) {
        super(scene, x, y, state ? textureOn : textureOff);

        this.scene = scene
        this.textureOn = textureOn
        this.textureOff = textureOff
        this.state = state

        this.setOrigin(0.5);
        this.setInteractive();

        // Click action
        this.on('pointerdown', this.toggle, this);

        // Add to the relevant scene
        scene.add.existing(this)
    }

    toggle() {
        this.state = !this.state
        this.setTexture(this.state ? this.textureOn : this.textureOff)

        // Ensure global variable is updated
        if(this === this.scene.toggleMusic) {
            musicOn = this.state
        } else if (this === this.scene.toggleSFX) {
            sfxOn = this.state
        }
    }
}