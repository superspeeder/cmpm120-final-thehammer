// Thug prefab
// (Thugs are the black-shirt common enemies)
class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)            // add to existing scene
        scene.physics.add.existing(this)    // add physics body

        this.setOrigin(0.5, 1.0)
        this.body.setCollideWorldBounds(true)

        // this.body.setImmovable(true)

        this.speed = 100
        this.attackRange = 150
        this.hitCount = 0
        this.hp = 3
        this.hitCooldown = false
        this.thisScene = scene

        this.leftAttackCollider = this.scene.physics.add.body(this.getLeftCenter().x - this.attackRange / 2, this.getLeftCenter().y - 36, this.attackRange / 2 - 1, 36)
        this.rightAttackCollider = this.scene.physics.add.body(this.getRightCenter().x, this.getRightCenter().y - 36, this.attackRange / 2 - 1, 36)

        // this.direction = direction
        // this.hurtTimer = 500    // in ms

        // initialize state machine
        this.fsm = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            defeat: new DefeatState()
        }, [scene, this])   // must be passed as args to maintain scene/object context
    }

    // thug AI
    facePlayer(currentX, direction, targetX) {
        if(direction == 'left' && currentX < targetX){
            direction = 'right'
        } else if (direction == 'right' && currentX > targetX) {
            direction = 'left'
        }
    }

    hurt(damage) {
        console.log("Ow!")
        this.hp -= damage;

        if (this.hp <= 0) {
            this.disableBody()
            // TODO: death animation
        }
    }

    update() {
        if (this.hp > 0) {
            this.leftAttackCollider.position = new Phaser.Math.Vector2(this.getLeftCenter().x - this.attackRange / 2 - 1, this.getLeftCenter().y - 36)
            this.rightAttackCollider.position = new Phaser.Math.Vector2(this.getRightCenter().x, this.getRightCenter().y - 36)
    
            this.fsm.step();    
        }
    }

    tryAttackPlayer() {
        if (this.attackCooldown) return
        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.leftAttackCollider, (object1, object2) => {
            this.fsm.transition('attack')
        })
    }

    attackLeft() {
        this.scene.physics.overlap(this.thisScene.player.hitCollider, this.leftAttackCollider, (object1, object2) => {
            this.thisScene.player.hurt(1)
        })

        this.scene.time.delayedCall(300, () => {
            this.fsm.transition('walk')
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
        // thug.anims.play(`idle-${thug.direction}`)
        // thug.anims.stop()
    }

    execute(scene, thug) {
        // if(Phaser.Math.Distance.Between(thug.x, thug.y, scene.player.getCenter().x, scene.player.getCenter().y) > thug.attackRange) {
        //     this.stateMachine.transition('walk')
        // } else {
        //     this.stateMachine.transition('attack')
        // }
        this.stateMachine.transition('walk')
        thug.tryAttackPlayer()
    }
}

class WalkState extends State {
    enter(scene, thug) {
        scene.physics.moveToObject(thug, scene.player, thug.speed)
    }

    execute(scene, thug) {
        scene.physics.moveToObject(thug, scene.player, thug.speed)
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

        // TODO: Play attack animation here

        if (scene.player.x < thug.getCenter().x) {
            scene.time.delayedCall(300, () => {
                thug.attackLeft()
            })
        } else {
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
        scene.time.delayedCall(1000, () => {
            thug.clearTint()
            thug.hitCooldown = false
            if(thug.hitCount >= thug.hp) {
                this.stateMachine.transition('defeat')
            } else {
                this.stateMachine.transition('idle')
            }
        })
    }
}

class DefeatState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        // TODO: play defeat animation
        scene.time.delayedCall(1000, () => thug.destroy())
    }
}