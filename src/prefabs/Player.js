class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursorKeys 
     * @param {Phaser.Physics.Arcade.Sprite[]} enemies 
     * @param {Phaser.Physics.Arcade.Sprite[]} extraSorts
     */
    constructor(scene, x, y, cursorKeys, enemies, extraSorts) {
        super(scene, x, y, "playerSprite")

        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.cursorKeys = cursorKeys

        this.body.setCollideWorldBounds(true)
        this.setOrigin(0.5, 1.0)
        this.body.setSize(34, 48).setOffset((this.width - 34) / 2.0, this.height - 48.0)

        this.SPEED = 200
        this.VERTICAL_SPEED = 200
        this.ENEMY_COLLIDE_VERTICAL_RANGE = 32 

        this.enemyColliders = []
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].playerColliderIndex = i
            this.enemyColliders.push({ collider: scene.physics.add.collider(this.body, enemies[i].body), enemy: enemies[i], isEnemy: true })
        }

        let start = this.enemyColliders.length;
        for (let i = 0; i < extraSorts.length; i++) {
            extraSorts[i].playerColliderIndex = i + start
            this.enemyColliders.push({ collider: scene.physics.add.collider(this.body, extraSorts[i].body), enemy: extraSorts[i], isEnemy: false })
        }

        this.punchKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)

        this.stateMachine = new StateMachine("IdleRight", {
            IdleRight: new PlayerIdleState("Right"),
            IdleLeft: new PlayerIdleState("Left"),
            WalkRight: new PlayerWalkState("Right"),
            WalkLeft: new PlayerWalkState("Left"),
            PunchRight: new PlayerPunchState("Right"),
            PunchLeft: new PlayerPunchState("Left"),
        }, [this, scene]);

        this.health = PLAYER_MAX_HEALTH
        this.points = 0

        this.leftPunchOverlapper = this.scene.physics.add.body(this.x - PLAYER_ATTACK_RANGE, this.y - PLAYER_FIST_HEIGHT - PLAYER_FIST_OFFSET, PLAYER_ATTACK_RANGE - 1, PLAYER_FIST_HEIGHT)
        this.rightPunchOverlapper = this.scene.physics.add.body(this.x, this.y - PLAYER_FIST_HEIGHT - PLAYER_FIST_OFFSET, PLAYER_ATTACK_RANGE - 1, PLAYER_FIST_HEIGHT)

        this.enemiesGroup = this.scene.physics.add.group(enemies);
        
        this.leftPunchOverlap = this.scene.physics.add.overlap(this.leftPunchOverlapper, this.enemiesGroup)
        this.rightPunchOverlap = this.scene.physics.add.overlap(this.rightPunchOverlapper, this.enemiesGroup)

        this.hitCollider = this.scene.physics.add.body(this.getTopLeft().x, this.getTopLeft().y, 60, 150).setOffset(0.0)

        this.thisScene = scene
    }

    update() {
        this.leftPunchOverlapper.position = new Phaser.Math.Vector2(this.x - PLAYER_ATTACK_RANGE, this.y - PLAYER_FIST_HEIGHT - PLAYER_FIST_OFFSET);
        this.rightPunchOverlapper.position = new Phaser.Math.Vector2(this.x, this.y - PLAYER_FIST_HEIGHT - PLAYER_FIST_OFFSET);

        this.hitCollider.position = new Phaser.Math.Vector2(this.getCenter().x - 34, this.getCenter().y - 50)

        this.stateMachine.step()
        this.ensureOrdering()
    }

    ensureOrdering() {
        for (let i = 0 ; i < this.enemyColliders.length ; i++) {
            let coll = this.enemyColliders[i];
            if (coll.enemy.y > this.y) {
                coll.enemy.setDepth(ABOVE_LAYER)
            } else {
                coll.enemy.setDepth(BELOW_LAYER)
            }
        }
    }

    hurt(hp) {
        console.log("Oof!")
        this.health -= hp
        this.addPoints(-1)

        if (this.health <= 0) {
            this.scene.sound.play("death")
            this.scene.scene.start("gameOverScene")
        } else {
            this.scene.sound.play("hit")
        }

        this.emit("playerhurt", this.health)

        // TODO: play a sound when the player gets hurt
    }

    setPoints(points) {
        let oldpoints = this.points
        this.points = points
        this.emit("playerpointschanged", this.points, this, oldpoints)
    }

    addPoints(points) {
        this.setPoints(this.points + points)        
    }

    /**
     * @param {boolean} facingRight Is the player facing right?
     */
    doAttackHits(facingRight) {
        if (facingRight) {
            this.scene.physics.overlap(this.rightPunchOverlapper, this.enemiesGroup, (object1, object2) => {
                if (object2.playerColliderIndex !== undefined) {
                    object2.hurt(PLAYER_ATTACK_DAMAGE)
                    this.addPoints(1)
                }
            })
        } else {
            this.scene.physics.overlap(this.leftPunchOverlapper, this.enemiesGroup, (object1, object2) => {
                if (object2.playerColliderIndex !== undefined) {
                    object2.hurt(PLAYER_ATTACK_DAMAGE)
                    this.addPoints(1)
                }
            })
        }
    }
}

class PlayerIdleState extends State {
    constructor(direction) {
        super()
        this.direction = direction
    }

    enter(player, scene) {
        player.play("Idle" + this.direction)
    }

    execute(player, scene) {
        if (player.cursorKeys.left.isDown) {
            player.stateMachine.transition("WalkLeft")
        } else if (player.cursorKeys.right.isDown) {
            player.stateMachine.transition("WalkRight")
        }

        if (player.cursorKeys.up.isDown || player.cursorKeys.down.isDown) {
            player.stateMachine.transition("Walk" + this.direction)
        }

        if (Phaser.Input.Keyboard.JustDown(player.punchKey)) {
            player.stateMachine.transition("Punch" + this.direction)
        }

        player.setVelocity(0, 0)
    }
}

class PlayerWalkState extends State {
    constructor(direction) {
        super()
        this.direction = direction
        this.left = direction == "Left"
    }

    enter(player, scene) {
        player.play("Walk" + this.direction)
    }

    execute(player, scene) {
        let switchTo = null

        let v = new Phaser.Math.Vector2(0.0, 0.0);
        if (player.cursorKeys.left.isDown) {
            v.x = -player.SPEED;
            if (!this.left) {
                switchTo = "WalkLeft"
            }
        } else if (player.cursorKeys.right.isDown) {
            if (this.left) {
                switchTo = "WalkRight"
            }
            v.x = player.SPEED;
        }

        if (player.cursorKeys.up.isDown) {
            v.y = -player.VERTICAL_SPEED;
        } else if (player.cursorKeys.down.isDown) {
            v.y = player.VERTICAL_SPEED;
        }

        if (v.lengthSq() > player.SPEED * player.SPEED) {
            v.normalize()
            v.x = v.x * player.SPEED
            v.y = v.y * player.SPEED
        }
        
        if (v.lengthSq() == 0) {
            switchTo = "Idle" + this.direction
        }

        player.body.setVelocity(v.x, v.y)

        if (Phaser.Input.Keyboard.JustDown(player.punchKey)) {
            switchTo = "Punch" + this.direction
        }

        if (switchTo !== null) {
            player.stateMachine.transition(switchTo, player, scene)
        }
    }
}

class PlayerPunchState extends State {
    constructor(direction) {
        super()
        this.direction = direction
    }

    enter(player, scene) {
        player.body.setVelocity(0, 0)
        player.play("Punch" + this.direction)
        player.once("animationcomplete", () => {
            player.stateMachine.transition("Idle" + this.direction)
        })
        player.doAttackHits(this.direction == "Right")
    }
}

const ABOVE_LAYER = 1
const BELOW_LAYER = -1
const PLAYER_FIST_OFFSET = 81
const PLAYER_FIST_HEIGHT = 36
const PLAYER_ATTACK_RANGE = 64
const PLAYER_ATTACK_DAMAGE = 1
const PLAYER_MAX_HEALTH = 5