// Thug prefab
// (Thugs are the black-shirt common enemies)
class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)            // add to existing scene
        scene.physics.add.existing(this)    // add physics body

        this.setOrigin(0.5, 1.0)
        this.body.setCollideWorldBounds(true)

        this.body.setSize(64, this.height / 2)
        this.body.setOffset((this.width - 64) / 2, this.height / 2)

        this.hitbox = this.scene.physics.add.body(this.x, this.y, 76, this.height * 1.2)
        this.hitbox.setOffset((this.width * 1.2 - 76) / 2, 0)

        this.dead = false

        this.speed = 100
        this.attackRange = 100
        this.hitCount = 0
        this.hp = 3
        this.hitCooldown = false
        this.thisScene = scene

        this.canBeHit = true

        this.leftAttackCollider = this.scene.physics.add.body(this.getLeftCenter().x - this.attackRange / 2, this.getLeftCenter().y - 36, this.attackRange / 2 - 1, 36)
        this.rightAttackCollider = this.scene.physics.add.body(this.getRightCenter().x, this.getRightCenter().y - 36, this.attackRange / 2 - 1, 36)

        // initialize state machine
        this.fsm = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            defeat: new DefeatState()
        }, [scene, this])   // must be passed as args to maintain scene/object context
    }

    hurt(damage) {
        if (!this.canBeHit || this.dead) {
            return 0
        }

        this.hp -= damage;

        if (this.hp <= 0) {
            this.disableBody()
            this.hitbox.setEnable(false)
            this.fsm.transition("defeat")
        } else {
            this.fsm.transition("hurt")
        }

        return 1
    }

    update() {
        if (this.dead) {
            return
        }

        if (this.hp <= 0 && this.fsm.state != "defeat") {
            this.dead = true
            this.fsm.transition("defeat")
        }

        this.hitbox.position = new Phaser.Math.Vector2(this.body.x, this.body.y - this.body.height)

        this.leftAttackCollider.position = new Phaser.Math.Vector2(this.body.left - this.attackRange / 2 - 1, this.getLeftCenter().y - 36)
        this.rightAttackCollider.position = new Phaser.Math.Vector2(this.body.right, this.getRightCenter().y - 36)

        this.fsm.step();
    }

    tryAttackPlayer() {
        if (this.attackCooldown) return

        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.leftAttackCollider, (object1, object2) => {
            this.fsm.transition('attack')
        })

        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.rightAttackCollider, (object1, object2) => {
            this.fsm.transition('attack')
        })

    }

    attackLeft() {
        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.leftAttackCollider, (object1, object2) => {
            this.thisScene.player.hurt(1)
        })

        this.scene.time.delayedCall(300, () => {
            if (this.fsm.state != "defeat") {
                this.fsm.transition('walk')
            }
        })
        this.scene.time.delayedCall(700, () => {
            this.attackCooldown = false
        })

    }

    attackRight() {
        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.rightAttackCollider, (object1, object2) => {
            this.thisScene.player.hurt(1)
        })

        this.scene.time.delayedCall(300, () => {
            this.fsm.transition('walk')
        })
        this.scene.time.delayedCall(700, () => {
            this.attackCooldown = false
        })
    }
}

// thug-specific state classes
class IdleState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        thug.clearTint()
    }

    execute(scene, thug) {
        this.stateMachine.transition('walk')
        thug.tryAttackPlayer()
    }
}

class WalkState extends State {
    enter(scene, thug) {
        let vel = new Phaser.Math.Vector2(scene.player.getCenter().x - thug.getCenter().x, scene.player.getCenter().y - thug.getCenter().y).normalize().scale(thug.speed)
        thug.setVelocity(vel.x, vel.y)
        // thug.body.setImmovable(false)
        
        if (scene.player.x < thug.getCenter().x) {
            thug.direction = "left"
            thug.play("walk-left")
        } else {
            thug.direction = "right"
            thug.play("walk-right")
        }
    }

    execute(scene, thug) {
        let vel = new Phaser.Math.Vector2(scene.player.getCenter().x - thug.getCenter().x, scene.player.getCenter().y - thug.getCenter().y).normalize().scale(thug.speed)
        thug.setVelocity(vel.x, vel.y)
        if (scene.player.x < thug.getCenter().x) {
            if (thug.direction != "left") {
                thug.play("walk-left")
            }

            thug.direction = "left"
        } else {
            if (thug.direction != "right") {
                thug.play("walk-right")
            }

            thug.direction = "right"
        }


        thug.tryAttackPlayer()
    }
}

class AttackState extends State {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Thug} thug 
     */
    enter(scene, thug) {
        thug.setVelocity(0, 0)
        thug.attackCooldown = true
        // thug.body.setImmovable(true)

        if (scene.player.x < thug.getCenter().x) {
            thug.play("attack-left")
            scene.time.delayedCall(300, () => {
                thug.attackLeft()
            })
        } else {
            thug.play("attack-right")
            scene.time.delayedCall(300, () => {
                thug.attackRight()
            })
        }

    }
}

class HurtState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        thug.setTint(0xff0000) // Flash red
        scene.sound.play("hit")

        if (scene.player.x < thug.getCenter().x) {
            thug.direction = "left"
            thug.play("hurt-left")
        } else {
            thug.direction = "right"
            thug.play("hurt-right")
        }
        
        // thug.body.setImmovable(true)

        thug.canBeHit = false

        scene.time.delayedCall(1000, () => {
            thug.clearTint()
            if (this.stateMachine.state == "hurt") {
                this.stateMachine.transition("idle")
            }
            thug.canBeHit = true
        })
    }
}

class DefeatState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        scene.sound.play("death")
        // thug.body.setImmovable(true)

        if (scene.player.x < thug.getCenter().x) {
            thug.direction = "left"
            thug.play("defeat-left")
        } else {
            thug.direction = "right"
            thug.play("defeat-right")
        }

        thug.dead = true
        thug.emit("dead")
    }
}