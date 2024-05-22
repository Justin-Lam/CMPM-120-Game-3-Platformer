class Walker extends Phaser.Physics.Arcade.Sprite
{
	// Constant Variables
	#START_X = 0;
	#START_Y = 0;
	#VELOCITY = 50;
	#direction = 1;


	// Methods
	constructor(scene, x, y)
	{
		super(scene, x, y, "Tilemap Transparent Spritesheet", 321);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.#START_X = x;
		this.#START_Y = y;
		this.setOrigin(0, 1);
		this.body.setSize(this.body.width-5, this.body.height-5);
		this.body.setOffset(2.5, 5);

		return this;
	}

	start()
	{
		this.#direction = 1;
		this.setPosition(this.#START_X, this.#START_Y);
		this.body.setEnable(true);
		this.setVisible(true);
		this.anims.play("Walker");
	}

	turn()
	{
		this.#direction *= -1;
		this.x += this.#direction*2;		// prevent walker from going inside turning point and glitching out
	}

	die()
	{
		this.body.setEnable(false);
		this.setVisible(false);
		this.scene.sound.play("Enemy Death");
	}

	preUpdate(time, delta)
	{
		super.preUpdate(time, delta);
		this.body.setVelocityX(this.#VELOCITY * this.#direction);
	}
}