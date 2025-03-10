// Thug prefab
// (Thugs are the black-shirt common enemies)
class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)            // add to existing scene
        scene.physics.add.existing(this)    // add physics body

        this.speed = 100
        this.attackRange = 50
        this.hitCount = 0
        this.hp = 3
        this.hitCooldown = false
        this.thisScene = scene

        this.setOrigin(0.5, 1.0)
        this.body.setImmovable(true)

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

    step() {
        this.fsm.step()
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
        if(Phaser.Math.Distance.Between(thug.x, thug.y, scene.player.x, scene.player.y) > thug.attackRange) {
            this.stateMachine.transition('walk')
        } else {
            this.stateMachine.transition('attack')
        }
    }
}

class WalkState extends State {
    enter(scene, thug) {
        scene.physics.moveToObject(thug, scene.player, thug.speed)
    }

    execute(scene, thug) {
        if(Phaser.Math.Distance.Between(thug.x, thug.y, scene.player.x, scene.player.y) <= thug.attackRange) {
            this.stateMachine.transition('attack')
        }
    }
}

class AttackState extends State {
    enter(scene, thug) {
        thug.setVelocity(0, 0)
        // TODO: Play attack animation here

        // TODO: player takes damage
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