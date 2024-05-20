/* TODO:
	make transparent decorations appear again
	map text for game title, controls
*/

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
	defaultTilesetImage = null;
	transparentTilesetImage = null;
	tilesetImages = [];
	backgroundLayer = null;
	groundAndPlatformsLayer = null;
	decorationsLayer = null;
	fallDeathZone = null;

	// Game Objects
	pixelGroup = null;
	player = null;
	pixelHUDElement = null;


	// Methods
	constructor()
	{
		super('level1Scene');
	}

	create()
	{
		// Set input
		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Set world
		this.physics.world.setBounds(0, -100, 1920, 320+100*2);
		this.physics.world.gravity.y = this.WORLD_GRAVITY;

		// Create map
		this.map = this.add.tilemap("Level 1 JSON", 16, 16, 120, 20);
		this.defaultTilesetImage = this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap Default Image");
		this.transparentTilesetImage = this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "Tilemap Transparent Image");
		this.tilesetImages = [this.defaultTilesetImage, this.transparentTilesetImage];
		this.backgroundLayer = this.map.createLayer("Background", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer = this.map.createLayer("Ground and Platforms", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer.setCollisionByExclusion([-1], true);
		this.decorationsLayer = this.map.createLayer("Decorations", this.tilesetImages, 0, 0);

		// Create fall death zone
		this.fallDeathZone = this.physics.add.staticSprite(this.map.widthInPixels/2, this.map.heightInPixels + 10/2)
		this.fallDeathZone.setSize(this.map.widthInPixels, 10);

		// Create pixels
		this.pixelGroup = this.physics.add.staticGroup();
		for (let pixel of this.map.getObjectLayer("Pixels").objects) {
			this.pixelGroup.add(new Pixel(this, pixel.x, pixel.y));
		}

		// Create player
		this.player = new Player(this, 0, 0);

		// Create colliders
		this.physics.add.collider(this.player, this.groundAndPlatformsLayer);
		this.physics.add.collider(this.player, this.fallDeathZone, () => {
			this.startLevel();
		});
		this.physics.add.overlap(this.player, this.pixelGroup, (player, pixel) => {
			pixel.onPlayerCollide();
		});

		// Set main camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
		this.cameras.main.setDeadzone(50, 50);
		this.cameras.main.setZoom(this.SCALE);

		// Set HUD
		this.pixelHUDElement = new PixelHUDElement(this, 610, 348);

		// Start level
		this.startLevel();
	}

	startLevel()
	{
		// Pixels
		for (let pixel of this.pixelGroup.getChildren()) {
			pixel.start();
		}
		
		// Player
		this.player.setPosition(0, 0);
		this.player.start();

		// HUD
		this.pixelHUDElement.start();
	}

	update(time, delta)
	{
		this.player.update(delta);
	}
}