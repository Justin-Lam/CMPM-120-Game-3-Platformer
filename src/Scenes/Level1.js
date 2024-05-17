class Level1 extends Phaser.Scene
{
	// Constant Variables
	SCALE = 5;
	WORLD_GRAVITY = 3500;

	// Game Objects
	player = null;


	// Methods
	constructor()
	{
		super('level1Scene')
	}

	create()
	{
		// Set world
		this.physics.world.gravity.y = this.WORLD_GRAVITY;

		// Set input
		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Create player
		this.player = new Player(this, 0, 400);
		this.player.initialize(this.moveLeftKey, this.moveRightKey, this.jumpKey);

		// Create temporary platform w/ collision w/ the player
		const platformWidth = 400;
        const platformHeight = 20;
        const platform = this.add.graphics();
        platform.fillStyle(0x00ff00, 1);
        platform.fillRect(0, 0, platformWidth, platformHeight);
		platform.setVisible(false);
        const platformTexture = platform.generateTexture('platformTexture', platformWidth, platformHeight);
        this.platformSprite = this.physics.add.staticSprite(500, 650, 'platformTexture');
		this.physics.add.collider(this.player, this.platformSprite);
	}

	update(time, delta)
	{
		this.player.update(delta);
	}
}