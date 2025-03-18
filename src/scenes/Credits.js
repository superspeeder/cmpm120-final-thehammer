class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene')
    }

    create() {
        // text
        this.add.text(centerX, centerY*2/6, 'Created by', creditTextConfig).setOrigin(0.5)
        this.add.text(centerX*1/2, centerY*3/6, 'Andy Newton', creditTextConfig).setOrigin(0.5)
        this.add.text(centerX*3/2, centerY*3/6, 'Joshua Acosta', creditTextConfig).setOrigin(0.5)

        // Return button
        new Button(this, centerX, centerY * 7/4, 'Return to Menu', () => {
            this.scene.start('menuScene')
        })
    }
}