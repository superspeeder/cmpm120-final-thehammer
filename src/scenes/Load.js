class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loadingbar
        let loadingBar = this.add.graphics()
        this.load.on('progress', (value) => {
            loadingBar.clear()
            loadingBar.fillStyle(0xffffff, 1)
            loadingBar.fillRect(0, centerY, width * value, 5)
        })
        this.load.on('complete', () => {
            loadingBar.destroy()
        })
        
        // LOAD ASSETS
        this.load.path = './assets/'
        // load audio
        // load fonts
        this.load.font('header', 'font/AlteHaasGroteskRegular.ttf')
        this.load.font('headerBold', 'font/AlteHaasGroteskBold.ttf')
        this.load.font('pixel', 'font/Square.ttf')
        this.load.font('clearPixel', 'font/Squareo.ttf')
        // load sprites
        this.load.image('fire', 'sprite/fire.png')
        this.load.spritesheet('animatetest', 'sprite/animationtest.png', {
            frameWidth: 12,
            frameHeight: 12,
        })
        this.load.spritesheet('thugAnimation', 'sprite/thug.png', {
            frameWidth: 164,
            frameHeight: 164
        })
      
        // TODO: load assets
        this.load.aseprite("playerSprite", "textures/player1.png", "textures/player1.json")
        this.load.image("level10", "textures/level10.png")
        this.load.image("rock", "textures/rock.png")

        this.load.spritesheet("healthbar", "textures/healthbar.png", { frameWidth: 80, frameHeight: 16 })

        this.load.audio("bgm", "music/bgm.wav")
        this.load.audio("hit", "music/hit.wav")
        this.load.audio("death", "music/death.wav")
        this.load.audio("win", "music/win.wav")
        this.load.audio("kill", "music/kill.wav")
    }

    create() {
        // THUG animations
        // idle
        this.anims.create({
            key: 'idle-left',
            frameRate: 8,
            repeat: -1,
            frames: [{key: 'thugAnimation', frame: 0}]
        })
        this.anims.create({
            key: 'idle-right',
            frameRate: 8,
            repeat: -1,
            frames: [{key: 'thugAnimation', frame: 1}]
        })
        // walk
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: [
                {key: 'thugAnimation', frame:0},
                {key: 'thugAnimation', frame:2}
            ]
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: [
                {key: 'thugAnimation', frame:1},
                {key: 'thugAnimation', frame:3}
            ]
        })
        // attack
        this.anims.create({
            key: 'attack-left',
            frameRate: 8,
            repeat: -1,
            frames: [
                {key: 'thugAnimation', frame:4},
                {key: 'thugAnimation', frame:0}
            ]
        })
        this.anims.create({
            key: 'attack-right',
            frameRate: 8,
            repeat: -1,
            frames: [
                {key: 'thugAnimation', frame:5},
                {key: 'thugAnimation', frame:1}
            ]
        })
        // hurt
        this.anims.create({
            key: 'hurt-left',
            frameRate: 8,
            repeat: -1,
            frames: [{key:'thugAnimation', frame:6}]
        })
        this.anims.create({
            key: 'hurt-right',
            frameRate: 8,
            repeat: -1,
            frames: [{key:'thugAnimation', frame:7}]
        })
        // defeat
        this.anims.create({
            key: 'defeat-left',
            frameRate: 8,
            repeat: -1,
            frames: [{key:'thugAnimation', frame:8}]
        })
        this.anims.create({
            key: 'defeat-right',
            frameRate: 12,
            repeat: -1,
            frames: [{key:'thugAnimation', frame:9}]
        })

        // TODO: load main menu scene from here
        this.anims.createFromAseprite("playerSprite", ["IdleLeft", "IdleRight", "WalkLeft", "WalkRight", "PunchLeft", "PunchRight"])

        this.anims.get("WalkLeft").repeat = -1;
        this.anims.get("WalkRight").repeat = -1;

        // go to Menu scene
        this.scene.start('menuScene')
    }

    update() {
        // is this necessary? I don't remember
    }
}