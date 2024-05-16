class Level1 extends Phaser.Scene {
	
	WORLD_GRAVITY = 3500;

	PLAYER_ACCELERATION = 2500;
	PLAYER_DRAG = 2500;
	PLAYER_AIR_DRAG_MULTIPLIER = 0.25;
	PLAYER_TURNING_ACCELERATION_MULTIPLIER = 2.0;
	PLAYER_MAX_VELOCITY = 500;	
	PLAYER_JUMP_VELOCITY = -1500;
	PLAYER_TERMINAL_VELOCITY = 3000;

	COYOTE_TIME_DURATION = 0.075;		// in seconds
	JUMP_BUFFER_DURATION = 0.075;		// in seconds
	coyoteTimeCounter = 0;
	jumpBufferCounter = 0;


	constructor()
	{
		super('level1Scene')
	}

	create()
	{
		this.physics.world.gravity.y = this.WORLD_GRAVITY;

		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.#initialize();
	}

	#initialize()
	{
		this.player = this.physics.add.sprite(0, 400, "Tilemap Transparent Spritesheet", 261);
		this.player.setScale(5);
		this.player.setCollideWorldBounds(true);





		// Create a rectangular platform using a graphics object
        const platformWidth = 400;
        const platformHeight = 20;
        const platform = this.add.graphics();
        platform.fillStyle(0x00ff00, 1);
        platform.fillRect(0, 0, platformWidth, platformHeight);
		platform.setVisible(false);
        
        // Create a static physics body for the platform
        const platformTexture = platform.generateTexture('platformTexture', platformWidth, platformHeight);
        this.platformSprite = this.physics.add.staticSprite(500, 650, 'platformTexture');

		// Enable collision between the player and the platform
        this.physics.add.collider(this.player, this.platformSprite);
	}

	update(time, delta)
	{
		this.#playerMovement();
		this.#playerJump(delta);
	}

	#playerMovement(delta)
	{
		// Move Left
		if (this.moveLeftKey.isDown)
		{
			// Fast Turning
			if (this.player.body.velocity.x > 0)
			{
				this.player.body.setAccelerationX(-this.PLAYER_ACCELERATION * this.PLAYER_TURNING_ACCELERATION_MULTIPLIER);
			}
			// Normal Acceleration
			else
			{
				this.player.body.setAccelerationX(-this.PLAYER_ACCELERATION);
			}

			// Cap Velocity
			if (this.player.body.velocity.x < -this.PLAYER_MAX_VELOCITY)
			{
				this.player.body.setVelocityX(-this.PLAYER_MAX_VELOCITY);
			}

			// Visuals
			this.player.setFlip(true, false);
			this.player.anims.play("Player Move", true);
		}

		// Move Right
		else if (this.moveRightKey.isDown)
		{
			// Fast Turning
			if (this.player.body.velocity.x < 0)
			{
				this.player.body.setAccelerationX(this.PLAYER_ACCELERATION * this.PLAYER_TURNING_ACCELERATION_MULTIPLIER);
			}
			// Normal Acceleration
			else
			{
				this.player.body.setAccelerationX(this.PLAYER_ACCELERATION);
			}

			// Cap Velocity
			if (this.player.body.velocity.x > this.PLAYER_MAX_VELOCITY)
			{
				this.player.body.setVelocityX(this.PLAYER_MAX_VELOCITY);
			}

			// Visuals
			this.player.resetFlip();
			this.player.anims.play("Player Move", true);
		}

		// Idle
		else
		{
			this.player.body.setAccelerationX(0);

			// Player on ground
			if (this.player.body.blocked.down)
			{
				this.player.body.setDragX(this.PLAYER_DRAG);
			}
			// Player in air
			else
			{
				this.player.body.setDragX(this.PLAYER_DRAG * this.PLAYER_AIR_DRAG_MULTIPLIER);
			}

			// Visuals
			this.player.anims.play("Player Idle", true);
		}
	}

	#playerJump(delta)
	{
		// Coyote Time
		if (this.player.body.blocked.down)		// on ground
		{
			this.coyoteTimeCounter = this.COYOTE_TIME_DURATION;
		}
		else									// not on ground
		{
			this.coyoteTimeCounter -= delta/1000;

			if (this.coyoteTimeCounter < 0)
			{
				this.coyoteTimeCounter = 0;
			}
		}

		// Jump Buffer
		if (this.jumpKey.isDown)
		{
			this.jumpBufferCounter = this.JUMP_BUFFER_DURATION;
		}
		else
		{
			this.jumpBufferCounter -= delta/1000;

			if (this.jumpBufferCounter < 0)
			{
				this.jumpBufferCounter = 0;
			}
		}

		// Jump
		if (this.coyoteTimeCounter > 0 && this.jumpBufferCounter > 0)
		{
			this.coyoteTimeCounter = 0;
			this.jumpBufferCounter = 0;
			this.player.body.setVelocityY(this.PLAYER_JUMP_VELOCITY);
		}

		// Jump Animation
		if (!this.player.body.blocked.down)
		{
			this.player.anims.play("Player Jump", true);
		}

		// Variable Jumping Height
		if (this.jumpKey.isUp && this.player.body.velocity.y < 0)
		{
			this.player.body.velocity.y *= 0.8;
		}

		// Down Gravity
		if (this.player.body.velocity.y > 0)
		{
			this.player.body.setGravityY(this.WORLD_GRAVITY);
		}
		else
		{
			this.player.body.setGravityY(0);
		}

		// Terminal Velocity Cap
		if (this.player.body.velocity.y > this.PLAYER_TERMINAL_VELOCITY)
		{
			console.log("NOTIFICAITON: Player exceeded terminal velocity");
			this.player.body.setVelocityY(this.PLAYER_TERMINAL_VELOCITY);
		}
	}
}