'use strict'

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    scene: [Load, Level10],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        }
    }
}

const game = new Phaser.Game(config)

let width = game.config.width, height = game.config.height;

const PLAYER_MAX_HEALTH = 100;