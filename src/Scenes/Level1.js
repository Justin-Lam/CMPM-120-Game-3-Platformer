class Level1 extends Phaser.Scene
{
	// Constants
	SCALE = 4;
	WORLD_GRAVITY = 600;

	// Input
	moveLeftKey = null;
	moveRightKey = null;
	jumpKey = null

	// Map
	map = null;
	mapTileset = null;
	backgroundLayer = null;
	groundAndPlatformsLayer = null;
	decorationsLayer = null;
	fallDeathZone = null;

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
		this.physics.world.setBounds(0, -100, 1920, 500);
		this.physics.world.gravity.y = this.WORLD_GRAVITY;

		// Set input
		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Create map
		this.map = this.add.tilemap("Level 1 JSON", 16, 16, 120, 20);
		this.mapTileset = this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap Default Image");
		this.backgroundLayer = this.map.createLayer("Background", this.mapTileset, 0, 0);
		this.groundAndPlatformsLayer = this.map.createLayer("Ground and Platforms", this.mapTileset, 0, 0);
		this.groundAndPlatformsLayer.setCollisionByExclusion([-1], true);
		this.decorationsLayer = this.map.createLayer("Decorations", this.mapTileset, 0, 0);

		// Create fall death zone
		this.add.graphics().generateTexture("fallDeathZoneTexture", this.map.widthInPixels, 10);
		this.fallDeathZone = this.physics.add.staticSprite(this.map.widthInPixels/2, this.map.heightInPixels + 10/2, "fallDeathZoneTexture");

		// Create player
		this.player = new Player(this, 0, 0);

		// Create colliders
		this.physics.add.collider(this.player, this.groundAndPlatformsLayer);
		this.physics.add.collider(this.player, this.fallDeathZone, () => {
			this.startLevel();
		});

		// Set main camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
		this.cameras.main.setDeadzone(50, 50);
		this.cameras.main.setZoom(this.SCALE);

		// Start level
		this.startLevel();
	}

	startLevel()
	{
		this.player.setPosition(0, 0);
		this.player.reset();
	}

	update(time, delta)
	{
		this.player.update(delta);
	}
}