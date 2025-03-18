class WinScene extends Phaser.Scene {
    constructor() {
        super("winScene")
    }

    create() {
        this.add.text(width / 2, height / 4, "You Win!", {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5)

        new Button(this, centerX, centerY * 5/4, 'Play Again', () => {
            this.scene.start('levelTenScene')
        })
        new Button(this, centerX, centerY * 5/4 + 48, 'Main Menu', () => {
            this.scene.start('menuScene')
        })
    }

    update() {

    }
}