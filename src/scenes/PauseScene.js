class PauseScene extends Phaser.Scene {
    constructor() {
        super("pauseScene")
    }
    
    create() {
        this.add.text(width / 2, height / 4, "Paused", {
            fontFamily: "headerBold",
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5)

        new Button(this, centerX, centerY * 5/4, 'Resume', () => {
            this.scene.switch('levelTenScene')
            game.sound.resumeAll()
        })
        new Button(this, centerX, centerY * 5/4 + 48, 'Start Over', () => {
            this.scene.stop('levelTenScene')
            this.scene.start('levelTenScene')
            game.sound.stopAll()
        })
        new Button(this, centerX, centerY * 5/4 + 96, 'Main Menu', () => {
            this.scene.stop('levelTenScene')
            this.scene.start('menuScene')
            game.sound.stopAll()
        })

        this.input.keyboard.on("keydown-ESC", () => {
            this.scene.switch('levelTenScene')
            game.sound.resumeAll()
        })
    }

    update() {

    }
}