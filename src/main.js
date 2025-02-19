'use strict'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Load],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config)

let width = game.config.width, height = game.config.height;

