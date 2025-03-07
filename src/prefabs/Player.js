class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursorKeys 
     * @param {Phaser.Physics.Arcade.Sprite[]} enemies 
     */
    constructor(scene, x, y, cursorKeys, enemies) {
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
            this.enemyColliders.push({ collider: scene.physics.add.collider(this.body, enemies[i].body), enemy: enemies[i] })
        }

        this.punchKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)

        this.stateMachine = new StateMachine("IdleRight", {
            IdleRight: new IdleState("Right"),
            IdleLeft: new IdleState("Left"),
            WalkRight: new WalkState("Right"),
            WalkLeft: new WalkState("Left"),
            PunchRight: new PunchState("Right"),
            PunchLeft: new PunchState("Left"),
        }, [this, scene]);
    }

    update() {
        this.stateMachine.step()
        this.ensureOrdering()
    }

    ensureOrdering() {
        for (let i = 0 ; i < this.enemyColliders.length ; i++) {
            let coll = this.enemyColliders[i];
            if (coll.enemy.y > this.y) {
                this.setBelow(coll.enemy)
            } else {
                this.setAbove(coll.enemy)
            }
        }
    }
}

class IdleState extends State {
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

        if (player.punchKey.isDown) {
            player.stateMachine.transition("Punch" + this.direction)
        }
    }
}

class WalkState extends State {
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

        if (player.punchKey.isDown) {
            switchTo = "Punch" + this.direction
        }

        if (switchTo !== null) {
            player.stateMachine.transition(switchTo, player, scene)
        }
    }
}

class PunchState extends State {
    constructor(direction) {
        super()
        this.direction = direction
    }

    enter(player, scene) {
        player.body.setVelocity(0, 0)
        player.play("Punch" + this.direction)
        player.on("animationcomplete", () => {
            player.stateMachine.transition("Idle" + this.direction)
        })
    }
}