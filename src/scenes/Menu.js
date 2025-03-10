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
    }

    update() {}
}