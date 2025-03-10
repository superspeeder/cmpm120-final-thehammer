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
        this.load.spritesheet('animatetest', 'sprites/animationtest.png', {
            frameWidth: 12,
            frameHeight: 12,
        })
      
        // TODO: load assets
        this.load.aseprite("playerSprite", "textures/player1.png", "textures/player1.json")
        this.load.image("sampleEnemySprite", "textures/sampleEnemySprite.png")
        this.load.image("level10", "textures/level10.png")
        this.load.image("rock", "textures/rock.png")
    }

    create() {
        // THUG animations
        // idle
        this.anims.create({
            key: 'idle-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 0, end: 2})
        })
        this.anims.create({
            key: 'idle-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 3, end: 5})
        })
        // walk
        this.anims.create({
            key: 'walk-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 6, end: 8})
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 9, end: 11})
        })
        // attack
        this.anims.create({
            key: 'attack-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 12, end: 14})
        })
        this.anims.create({
            key: 'attack-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 15, end: 17})
        })
        // hurt
        this.anims.create({
            key: 'hurt-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 18, end: 20})
        })
        this.anims.create({
            key: 'hurt-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 21, end: 23})
        })
        // defeat
        this.anims.create({
            key: 'defeat-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 24, end: 26})
        })
        this.anims.create({
            key: 'defeat-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('animatetest', { start: 27, end: 29})
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