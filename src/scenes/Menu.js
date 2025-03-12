class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    init() {}

    preload() {}

    create() {
        new Button(this, centerX, centerY * 5/4, 'Play', () => {
            this.scene.start('levelTenScene')
        })

        this.add.text(width / 2, 3 * height / 4, "Controls: Arrow keys to move.\n  C to punch.", {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5)
    }

    update() {}
}