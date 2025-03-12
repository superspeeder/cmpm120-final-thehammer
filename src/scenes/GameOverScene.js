class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameOverScene")
    }

    create() {
        this.add.text(width / 2, height / 4, "Game Over", {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5)

        new Button(this, centerX, centerY * 5/4, 'Try Again', () => {
            this.scene.start('levelTenScene')
        })
    }

    update() {

    }
}