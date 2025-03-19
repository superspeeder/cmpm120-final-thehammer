class LevelTen extends Phaser.Scene {
    constructor() {
        super('levelTenScene')
    }

    init() {}

    preload() {}

    create() {
        this.worldBackground = this.add.image(0, 0, "level10").setOrigin(0, 0).setDepth(-100)
        this.cursorKeys = this.input.keyboard.createCursorKeys()

        this.rock1 = new Rock(this, 95, 889)
        this.rock2 = new Rock(this, 221, 631)
        this.rock3 = new Rock(this, 923, 790)

        this.rocks = this.add.group()
        this.rocks.add(this.rock1)
        this.rocks.add(this.rock2)
        this.rocks.add(this.rock3)

        this.enemies = this.add.group()
        this.thug = new Thug(this, 800, 600, 'thugAnimation').setScale(1.2)
        this.enemies.add(this.thug)


        this.wave2 = {thug1: new Thug(this, 0, 0, 'thugAnimation').setScale(1.2), thug2: new Thug(this, 0, 0, 'thugAnimation').setScale(1.2), thug3: new Thug(this, 0, 0, 'thugAnimation').setScale(1.2)}
        this.wave2.thug1.body.setEnable(false)
        this.wave2.thug2.body.setEnable(false)
        this.wave2.thug3.body.setEnable(false)

        this.enemies.add(this.wave2.thug1)
        this.enemies.add(this.wave2.thug2)
        this.enemies.add(this.wave2.thug3)
        
        this.physics.add.collider(this.rocks,this.enemies)
        this.physics.add.collider(this.enemies,this.enemies)

        this.player = new Player(this, 100, 3.0 * game.config.height / 4.0, this.cursorKeys, [this.thug, this.wave2.thug1, this.wave2.thug2, this.wave2.thug3], [this.rock1, this.rock2, this.rock3]).setScale(1.5)

        this.worldUpperLimit = this.physics.add.staticBody(0.0, 0.0, game.config.width, game.config.height / 2.0)
        this.physics.add.collider(this.player, this.worldUpperLimit)

        // TODO: replace this with bitmap text
        let textConfig = {
            fontFamily: 'headerBold',
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#704214',
            padding: { x: 10, y: 5 },
            align: 'center'
        }

        this.pointsDisplay = this.add.text(game.config.width - 110, 30, "0", textConfig)

        this.player.on("playerpointschanged", (/** @type {integer} */ points) => {
            this.pointsDisplay.setText(points.toString())
        })

        this.healthBar = this.add.sprite(60, 60, "healthbar", 0).setOrigin(0).setScale(3)
    
        this.player.on("playerhurt", (newHealth) => {
            this.healthBar.setFrame(Math.ceil((PLAYER_MAX_HEALTH - newHealth) / 2))
        })

        this.sound.play("bgm", {loop: true, volume:0.5})

        this.thug.on("dead", () => {
            this.enterWave2()
        })

        this.inWinEnd = false

        this.wave = 1

        this.input.keyboard.on("keydown-ESC", () => {
            this.scene.switch('pauseScene')
            this.sound.pauseAll()
        })
    }

    enterWave2() {
        this.wave = 0

        this.tweens.add({
            targets: this.thug,
            y: '-=25',
            alpha: 0.0,
            ease: 'Cubic',
            duration: 1000,
            repeat: 0,
            delay: 250,
            yoyo: false,
            onComplete: () => {
                // when this animation finishes, make sure the original enemy is removed fully from the working parts of the scene (don't want to destroy them since they are stilled referenced by the player).
                this.thug.body.setEnable(false)
                this.thug.setPosition(0, 0)
                this.thug.setVisible(false)
                
                // show the new enemies and place them somewhere offscreen, far enough apart that their colliders aren't touching (so that the physics works right).
                this.wave2.thug1.setVisible(true)
                this.wave2.thug2.setVisible(true)
                this.wave2.thug3.setVisible(true)

                this.wave2.thug1.body.setEnable(true)
                this.wave2.thug2.body.setEnable(true)
                this.wave2.thug3.body.setEnable(true)

                this.wave2.thug1.setAlpha(1.0)
                this.wave2.thug2.setAlpha(1.0)
                this.wave2.thug3.setAlpha(1.0)

                this.wave2.thug1.setPosition(width + 16, Phaser.Math.Between(height / 2 + 64, height - 64))
                this.wave2.thug2.setPosition(width + 144, Phaser.Math.Between(height / 2 + 64, height - 64))
                this.wave2.thug3.setPosition(width + 272, Phaser.Math.Between(height / 2 + 64, height - 64))
                this.wave = 2
            }
        })
    }

    update() {
        // step(update) state machines
        this.player.update()

        if (!this.inWinEnd && this.wave2.thug1.dead && this.wave2.thug2.dead && this.wave2.thug3.dead) {
            this.inWinEnd = true
            this.tweens.add({
                targets: [this.wave2.thug1, this.wave2.thug2, this.wave2.thug3],
                y: '-=25',
                alpha: 0.0,
                ease: 'Cubic',
                duration: 1000,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.thug.body.setEnable(false)
                    this.thug.setPosition(0, 0)
                    this.thug.setVisible(false)
                    
                    this.wave2.thug1.setVisible(false)
                    this.wave2.thug2.setVisible(false)
                    this.wave2.thug3.setVisible(false)

                    this.wave2.thug1.setPosition(0, 0)
                    this.wave2.thug2.setPosition(0, 0)
                    this.wave2.thug3.setPosition(0, 0)

                    this.sound.stopAll()
                    this.scene.start("winScene")
                }
            })
        }

        if (this.wave == 1) {
            this.thug.update()
        } else if (this.wave == 2) {
            this.wave2.thug1.update()
            this.wave2.thug2.update()
            this.wave2.thug3.update()
        }
    }

    enemyFollows() {
        this.physics.moveToObject(this.thug, this.player, 100)
    }
}