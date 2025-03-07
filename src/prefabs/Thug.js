// Thug prefab
// (Thugs are the black-shirt common enemies)
class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture)
        scene.add.existing(this)            // add to existing scene
        scene.physics.add.existing(this)    // add physics body

        this.player = player    // Reference to the player
        this.speed = 100
        this.attackRange = 50
        this.hitCount = 0
        this.hp = 3
        this.hitCooldown = false

        // this.direction = direction
        // this.hurtTimer = 500    // in ms

        // initialize state machine
        scene.thugFSM = new StateMachine('idle', {
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
}

// thug-specific state classes
class IdleState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        // thug.anims.play(`idle-${thug.direction}`)
        // thug.anims.stop()
    }

    execute(scene, thug) {
        if(Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > this.attackRange) {
            this.stateMachine.transition('walk')
        } else {
            this.stateMachine.transition('attack')
        }
    }
}

class WalkState extends State {
    enter(scene, thug) {
        this.scene.physics.moveToObject(this, this.player, this.speed)
    }

    execute(scene, thug) {
        if(Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) <= this.attackRange) {
            this.stateMachine.transition('attack')
        }
    }
}

class AttackState extends State {
    enter(scene, thug) {
        this.setVelocity(0, 0)
        // TODO: Play attack animation here

        // TODO: player takes damage
    }
}

class HurtState extends State {
    enter(scene, thug) {
        this.setVelocity(0)
        this.setTint(0xff0000) // Flash red
        this.scene.time.delayedCall(1000, () => {
            this.clearTint()
            this.hitCooldown = false
            if(this.hitCount >= this.hp) {
                this.stateMachine.transition('defeat')
            } else {
                this.stateMachine.transition('idle')
            }
        })
    }
}

class DefeatState extends State {
    enter(scene, thug) {
        this.setVelocity(0)
        // TODO: play defeat animation
        this.scene.time.delayedCall(1000, () => this.destroy())
    }
}