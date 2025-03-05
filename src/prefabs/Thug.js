// Thug prefab
// (Thugs are the black-shirt common enemies)
class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)            // add to existing scene
        scene.physics.add.existing(this)    // add physics body

        this.body.setSize(this.width/2, this.height/2)
        // this.body.setCollideWorldBounds(true)

        this.direction = direction
        this.hurtTimer = 500    // in ms

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
        thug.anims.play(`idle-${thug.direction}`)
        thug.anims.stop()
    }
}

class WalkState extends State {
    enter(scene, thug) {}

    execute(scene, thug) {}
}

class AttackState extends State {
    enter(scene, thug) {}

    execute(scene, thug) {}
}

class HurtState extends State {
    enter(scene, thug) {}

    execute(scene, thug) {}
}

class DefeatState extends State {
    enter(scene, thug) {}

    execute(scene, thug) {}
}