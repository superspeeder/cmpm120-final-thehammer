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

        this.enemies = this.add.group()
        this.thug = new Thug(this, 800, 600, 'animatetest').setScale(8.0)
        this.enemies.add(this.thug)

        this.player = new Player(this, 100, 3.0 * game.config.height / 4.0, this.cursorKeys, [this.thug], [this.rock1, this.rock2, this.rock3]).setScale(1.5)

        this.worldUpperLimit = this.physics.add.staticBody(0.0, 0.0, game.config.width, game.config.height / 2.0)
        this.physics.add.collider(this.player, this.worldUpperLimit)

        // TODO: replace this with bitmap text
        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "24px",
            backgroundColor: "white",
            fixedWidth: 80,
            color: "black",
            align: "right",
        }

        this.pointsDisplay = this.add.text(game.config.width - 110, 30, "0", textConfig)

        this.player.on("playerpointschanged", (/** @type {integer} */ points) => {
            this.pointsDisplay.setText(points.toString)
        })

        this.healthBar = this.add.sprite(60, 60, "healthbar", 0).setOrigin(0).setScale(3)
    
        this.player.on("playerhurt", (newHealth) => {
            this.healthBar.setFrame(PLAYER_MAX_HEALTH - newHealth)
        })

        this.sound.play("bgm", {loop: true, volume:0.5})
        
    }

    update() {
        // step(update) state machines
        this.player.update()
        this.thug.update()
    }

    enemyFollows() {
        this.physics.moveToObject(this.thug, this.player, 100)
    }
}