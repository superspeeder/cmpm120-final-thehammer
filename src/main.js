'use strict'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Load, Menu, LevelTen, LevelFinal],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config)

// define global variables
let width = game.config.width, height = game.config.height
let centerX = width/2, centerY = height/2
