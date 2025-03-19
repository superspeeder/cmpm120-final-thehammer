class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    init() {}

    preload() {}

    create() {
        // Fire effect
        let line = new Phaser.Geom.Line(0, centerY*1.1, width, centerY*1.1)
        this.lineEmitter = this.add.particles(0, centerY*1.1, 'fire', {
            gravityY: -300,
            lifespan: 3000,
            scale: {start: 5, end: 0.1},
            emitZone: {
                type: 'random',
                source: line,
                quantity: 50
            }
        })

        this.add.text(centerX, centerY * 1/2, 'Nobody Beats', titleTextConfig).setOrigin(0.5)
        this.add.text(centerX, centerY * 3/4, 'The Hammer', titleTextConfig).setOrigin(0.5)
        
        new Button(this, centerX, centerY * 5/4, 'Play', () => {
            this.scene.start('levelTenScene')
        })
        new Button(this, centerX, centerY * 7/4, 'Credits', () => {
            this.scene.start('creditsScene')
        });

        this.add.text(width / 2, 3 * height / 4, "Controls: Arrow keys to move.\n  C to punch.", {
            fontFamily: "headerBold",
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5)
    }

    update() {}
}