'use strict'

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [Load, Menu, LevelTen, LevelFinal],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const titleTextConfig = {
    fontFamily: 'headerBold',
    fontsize: '36px',
    color: '#ff0000',
    align: 'center',
    padding: {
        top: 5,
        bottom: 5
    }
}

const scoreTextConfig = {
    fontFamily: 'pixel',
    fontSize: '10px',
    color: '#000000',
    backgroundColor: '#ffff00',
    padding: {
        top: 5,
        bottom: 5
    }
}

const game = new Phaser.Game(config)

// define global variables
let width = game.config.width, height = game.config.height
let centerX = width/2, centerY = height/2
