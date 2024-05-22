class Player extends Phaser.Physics.Arcade.Sprite
{
	// Constant Variables
	#ACCELERATION = 500;
	#TURNING_ACCELERATION_MULTIPLIER = 2.0;
	#DRAG = 500;
	#AIR_DRAG_MULTIPLIER = 0.25;
	#MAX_VELOCITY = 100;
	#ANGULAR_VELOCITY = 15;
	#TURNING_ANGULAR_VELOCITY_MULTIPLIER = 2.0;
	#MAX_TURN_ANGLE = 2;
	#JUMP_VELOCITY = -300;
	#TERMINAL_VELOCITY = 600;
	#COYOTE_TIME_DURATION = 0.075;		// in seconds
	#JUMP_BUFFER_DURATION = 0.1;		// in seconds
	
	// Dynamic Variables
	#controllable = true;
	#hasJump = true;
	#coyoteTimeCounter = 0;
	#jumpBufferCounter = 0;

	// Reference Variables
	#moveLeftKey = null;
	#moveRightKey = null;
	#jumpKey = null;
	#moveParticles = null;
	#jumpParticles = null;


	// Methods
	constructor(scene, x, y)
	{
		super(scene, x, y, "Tilemap Transparent Spritesheet", 261);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);

		this.body.setMaxVelocityX(this.#MAX_VELOCITY);

		this.#moveLeftKey = scene.moveLeftKey;
		this.#moveRightKey = scene.moveRightKey;
		this.#jumpKey = scene.jumpKey;
		this.#moveParticles = scene.playerMoveParticles;
		this.#jumpParticles = scene.playerJumpParticles;

		this.#jumpKey.on("down", (key, event) => {
			if (this.#hasJump) {
				this.#jumpBufferCounter = this.#JUMP_BUFFER_DURATION;
			}
		});

		return this;
	}

	start()
	{
		this.#controllable = true;
		this.body.setAngularVelocity(0);
		this.setAngle(0);
		this.resetFlip();
	}

	die()
	{
		this.#controllable = false;

		this.body.setAccelerationX(0);
		this.body.setDragX(0);
		this.setAngle(0);
		this.#moveParticles.stop();

		this.body.setGravityY(0);
		this.#jumpParticles.stop();

		this.anims.stop();
		this.setFrame(265);

		this.forceJump(1);
		if (this.body.velocity.x == 0)
		{
			let direction = 0;
			if (Math.random() < 0.5) {
				direction = -1;
			}
			else {
				direction = 1;
			}
			this.body.setVelocityX(50 * direction);
		}
		this.body.setAngularVelocity(720 * Math.sign(this.body.velocity.x));


		this.scene.sound.play("Player Death");
	}

	update(delta)
	{
		if (this.#controllable)
		{
			this.#movement();
			this.#jump(delta);
		}
	}

	#movement()
	{
		// Move Left
		if (this.#moveLeftKey.isDown)
		{
			// Movement
			if (this.body.velocity.x > 0)		// fast turning
			{
				this.body.setAccelerationX(-this.#ACCELERATION * this.#TURNING_ACCELERATION_MULTIPLIER);
			}
			else										// normal acceleration
			{
				this.body.setAccelerationX(-this.#ACCELERATION);
			}

			// Rotation
			if (this.angle > 0)		// fast turning
			{
				this.setAngularVelocity(-this.#ANGULAR_VELOCITY * this.#TURNING_ANGULAR_VELOCITY_MULTIPLIER);
			}
			else							// normal velocity
			{
				this.setAngularVelocity(-this.#ANGULAR_VELOCITY);
			}

			if (this.angle < -this.#MAX_TURN_ANGLE)		// cap angle
			{
				this.angle = -this.#MAX_TURN_ANGLE;
			}

			// Animation
			this.setFlip(true, false);
			this.anims.play("Player Move", true);

			// Particles
			this.#moveParticles.startFollow(this, this.displayWidth/2 - 10, this.displayHeight-10);
			if (this.body.blocked.down) {
				this.#moveParticles.start();
			}
			else
			{
				this.#moveParticles.stop();
			}
		}

		// Move Right
		else if (this.#moveRightKey.isDown)
		{
			// Movement
			if (this.body.velocity.x < 0)		// fast turning
			{
				this.body.setAccelerationX(this.#ACCELERATION * this.#TURNING_ACCELERATION_MULTIPLIER);
			}
			else										// normal acceleration
			{
				this.body.setAccelerationX(this.#ACCELERATION);
			}

			// Rotation
			if (this.angle < 0)		// fast turning
			{
				this.setAngularVelocity(this.#ANGULAR_VELOCITY * this.#TURNING_ANGULAR_VELOCITY_MULTIPLIER);
			}
			else							// normal velocity
			{
				this.setAngularVelocity(this.#ANGULAR_VELOCITY);
			}

			if (this.angle > this.#MAX_TURN_ANGLE)		// cap angle
			{
				this.angle = this.#MAX_TURN_ANGLE;
			}

			// Animation
			this.resetFlip();
			this.anims.play("Player Move", true);

			// Particles
			this.#moveParticles.startFollow(this, -this.displayWidth/2 + 10, this.displayHeight-10);
			if (this.body.blocked.down) {
				this.#moveParticles.start();
			}
			else
			{
				this.#moveParticles.stop();
			}
		}

		// Idle
		else
		{
			// Movement
			this.body.setAccelerationX(0);

			if (this.body.blocked.down)		// player on ground
			{
				this.body.setDragX(this.#DRAG);
			}
			else									// player in air
			{
				this.body.setDragX(this.#DRAG * this.#AIR_DRAG_MULTIPLIER);
			}

			// Rotation
			this.setAngularVelocity(0);

			if (this.angle < 0)
			{
				this.angle += 1;
				if (this.angle > 0)
				{
					this.angle = 0;
				}
			}
			else if (this.angle > 0)
			{
				this.angle -= 1;
				if (this.angle < 0)
				{
					this.angle = 0;
				}
			}

			// Animation
			this.anims.play("Player Idle", true);

			// Particles
			this.#moveParticles.stop();
		}
	}

	#jump(delta)
	{
		// Coyote Time
		if (this.body.blocked.down)		// on ground
		{
			this.#coyoteTimeCounter = this.#COYOTE_TIME_DURATION;
		}
		else							// not on ground
		{
			this.#coyoteTimeCounter -= delta/1000;

			if (this.#coyoteTimeCounter < 0)
			{
				this.#coyoteTimeCounter = 0;
			}
		}

		// Jump Buffer
		if (this.#jumpBufferCounter > 0)
		{
			this.#jumpBufferCounter -= delta/1000;

			if (this.#jumpBufferCounter < 0)
			{
				this.#jumpBufferCounter = 0;
			}
		}

		// Jump
		if (this.#coyoteTimeCounter > 0 && this.#jumpBufferCounter > 0 && this.#hasJump)
		{
			this.#coyoteTimeCounter = 0;
			this.#jumpBufferCounter = 0;
			this.#hasJump = false;

			this.body.setVelocityY(this.#JUMP_VELOCITY);
			this.#jumpParticles.setPosition(this.x, this.y + this.displayHeight-10);
			this.#jumpParticles.start();
			this.scene.sound.play("Player Jump");
		}

		// Jump Animation
		if (!this.body.blocked.down)
		{
			this.anims.play("Player Jump", true);
		}

		// Variable Jumping Height
		if (this.#jumpKey.isUp && this.body.velocity.y < 0)
		{
			this.body.velocity.y *= 0.8;
		}

		// Down Gravity
		if (this.body.velocity.y > 0)
		{
			this.body.setGravityY(this.scene.WORLD_GRAVITY);
		}
		else
		{
			this.body.setGravityY(0);
		}

		// Terminal Velocity Cap
		if (this.body.velocity.y > this.#TERMINAL_VELOCITY)
		{
			console.log("NOTIFICAITON: Player exceeded terminal velocity");
			this.body.setVelocityY(this.#TERMINAL_VELOCITY);
		}

		// Get Jump Back
		if (this.#jumpKey.isUp)
		{
			this.#hasJump = true;
		}
	}

	forceJump(jumpVelocityMultiplier)
	{
		this.body.setVelocityY(this.#JUMP_VELOCITY * jumpVelocityMultiplier);
	}
}