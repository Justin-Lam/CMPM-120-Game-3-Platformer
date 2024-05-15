class Level1 extends Phaser.Scene {
	
	WORLD_GRAVITY = 3500;

	PLAYER_ACCELERATION = 2500;
	PLAYER_DRAG = 2500;
	PLAYER_AIR_DRAG_MULTIPLIER = 0.25;
	PLAYER_TURNING_ACCELERATION_MULTIPLIER = 2.0;
	PLAYER_MAX_VELOCITY = 500;
	PLAYER_JUMP_VELOCITY = -1750;
	PLAYER_TERMINAL_VELOCITY = 3000;


	constructor()
	{
		super('level1Scene')
	}

	create()
	{
		this.physics.world.gravity.y = this.WORLD_GRAVITY;

		/*
		this.map = this.add.tilemap("Level 1", 16, 16, 120, 20);
		this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap");
		this.groundLayer = this.map.createLayer("Ground and Platforms", this.tileset, 0, 0);
		this.groundLayer.setScale(2.8);
		this.groundLayer.setCollisionByProperty({ collides: true });
		*/

		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


		this.#initialize();
	}

	#initialize()
	{
		this.player = this.physics.add.sprite(0, 400, "Player 0");
		this.player.setScale(5);
		this.player.setCollideWorldBounds(true);
	}

	update()
	{
		this.#playerMovement();
		this.#playerJump();
	}

	#playerMovement()
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

	#playerJump()
	{
		// Jump
		if (this.jumpKey.isDown && this.player.body.blocked.down)
		{
			this.player.body.setVelocityY(this.PLAYER_JUMP_VELOCITY);
		}

		// Jump Animation
		if (!this.player.body.blocked.down)
		{
			this.player.anims.play("Player Jump", true);
		}

		// Down Gravity
		if (!this.player.body.blocked.down && (this.jumpKey.isUp || this.player.body.velocity.y > 0))
		{
			this.player.body.setGravityY(this.WORLD_GRAVITY);
		}

		// Reset Down Gravity
		if (this.player.body.blocked.down)
		{
			this.player.body.setGravityY(0);
		}

		// Cap Velocity
		if (this.player.body.velocity.y > this.PLAYER_TERMINAL_VELOCITY)
			{
				console.log("NOTIFICAITON: Player exceeded terminal velocity");
				this.player.body.setVelocityY(this.PLAYER_TERMINAL_VELOCITY);
			}
	}
}