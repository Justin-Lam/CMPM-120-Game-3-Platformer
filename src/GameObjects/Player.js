class Player extends Phaser.Physics.Arcade.Sprite
{
	// Constant Variables
	#ACCELERATION = 500;
	#DRAG = 500;
	#TURNING_ACCELERATION_MULTIPLIER = 2.0;
	#MAX_VELOCITY = 100;
	#AIR_DRAG_MULTIPLIER = 0.25;
	#ANGULAR_VELOCITY = 50;
	#TURNING_ANGULAR_VELOCITY_MULTIPLIER = 2.0;
	#JUMP_VELOCITY = -300;
	#TERMINAL_VELOCITY = 600;
	#COYOTE_TIME_DURATION = 0.075;		// in seconds
	#JUMP_BUFFER_DURATION = 0.075;		// in seconds
	
	// Dynamic Variables
	#hasJump = true;
	#coyoteTimeCounter = 0;
	#jumpBufferCounter = 0;

	// Reference Variables
	#moveLeftKey = null;
	#moveRightKey = null;
	#jumpKey = null;


	// Methods
	constructor(scene, x, y)
	{
		super(scene, x, y, "Tilemap Transparent Spritesheet", 261)
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);

		this.#moveLeftKey = this.scene.moveLeftKey;
		this.#moveRightKey = this.scene.moveRightKey;
		this.#jumpKey = this.scene.jumpKey;

		return this;
	}

	reset()
	{
		this.texture = "Tilemap Transparent Spritesheet";
		this.frame = 261;
	}

	update(delta)
	{
		this.#movement();
		this.#jump(delta);
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

			if (this.body.velocity.x < -this.#MAX_VELOCITY)		// cap velocity
			{
				this.body.setVelocityX(-this.#MAX_VELOCITY);
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

			if (this.angle < -5)		// cap angle
			{
				this.angle = -5;
			}

			// Animation
			this.setFlip(true, false);
			this.anims.play("Player Move", true);
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

			if (this.body.velocity.x > this.#MAX_VELOCITY)		// cap velocity
			{
				this.body.setVelocityX(this.#MAX_VELOCITY);
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

			if (this.angle > 5)		// cap angle
			{
				this.angle = 5;
			}

			// Animation
			this.resetFlip();
			this.anims.play("Player Move", true);
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
		}
	}

	#jump(delta)
	{
		// Coyote Time
		if (this.body.blocked.down)		// on ground
		{
			this.#coyoteTimeCounter = this.#COYOTE_TIME_DURATION;
		}
		else									// not on ground
		{
			this.#coyoteTimeCounter -= delta/1000;

			if (this.#coyoteTimeCounter < 0)
			{
				this.#coyoteTimeCounter = 0;
			}
		}

		// Jump Buffer
		if (this.#jumpKey.isDown && this.#hasJump)
		{
			this.#jumpBufferCounter = this.#JUMP_BUFFER_DURATION;
		}
		else
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
}