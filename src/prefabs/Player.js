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
        super(scene, x, y, "playerSprite", "IdleRight")
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
    }

    update() {
        let v = new Phaser.Math.Vector2(0.0, 0.0);
        if (this.cursorKeys.left.isDown) {
            v.x = -this.SPEED;
        } else if (this.cursorKeys.right.isDown) {
            v.x = this.SPEED;
        }

        if (this.cursorKeys.up.isDown) {
            v.y = -this.VERTICAL_SPEED;
        } else if (this.cursorKeys.down.isDown) {
            v.y = this.VERTICAL_SPEED;
        }

        if (v.lengthSq() > this.SPEED * this.SPEED) {
            v.normalize()
            v.x = v.x * this.SPEED
            v.y = v.y * this.SPEED
        }

        this.body.setVelocity(v.x, v.y)

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
