'use strict'

// Authors: Andy Newton, Joshua Acosta
// Phaser Components Used: Tweens, Particle Systems, Animation Manager, Arcade Physics, Text Objects, Timers


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    scene: [Load, Menu, LevelTen, GameOverScene, Credits, WinScene, PauseScene],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    }
}

const titleTextConfig = {
    fontFamily: 'headerBold',
    fontSize: '96px',
    color: '#ff0000',
    align: 'center',
    padding: {
        top: 5,
        bottom: 5
    }
}

const creditTextConfig = {
    fontFamily: 'headerBold',
    fontSize: '36px',
    color: '#000000',
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
var musicOn = true, sfxOn = true
