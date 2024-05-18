/* TODO:
	pixel class
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
	mapTileset = null;
	backgroundLayer = null;
	groundAndPlatformsLayer = null;
	decorationsLayer = null;
	fallDeathZone = null;

	// Game Objects
	pixels = [];
	pixelGroup = null;
	player = null;

	// HUD
	playerPixels = 0;
	pixelHUDImage = null;
	pixelHUDText = null;


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
		this.mapTileset = this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap Default Image");
		this.backgroundLayer = this.map.createLayer("Background", this.mapTileset, 0, 0);
		this.groundAndPlatformsLayer = this.map.createLayer("Ground and Platforms", this.mapTileset, 0, 0);
		this.groundAndPlatformsLayer.setCollisionByExclusion([-1], true);
		this.decorationsLayer = this.map.createLayer("Decorations", this.mapTileset, 0, 0);

		// Create fall death zone
		this.fallDeathZone = this.physics.add.staticSprite(this.map.widthInPixels/2, this.map.heightInPixels + 10/2)
		this.fallDeathZone.setSize(this.map.widthInPixels, 10);

		// Create pixels
		this.pixels = this.map.createFromObjects("Pixels", {
			key: "Tilemap Transparent Spritesheet",
			frame: 20
		});
		this.physics.world.enable(this.pixels, Phaser.Physics.Arcade.STATIC_BODY);
		for (let pixel of this.pixels)
		{
			pixel.body.setSize(10, 10);
			pixel.anims.play("Pixel");
		}
		this.pixelGroup = this.add.group(this.pixels);

		// Create player
		this.player = new Player(this, 0, 0);

		// Create colliders
		this.physics.add.collider(this.player, this.groundAndPlatformsLayer);
		this.physics.add.collider(this.player, this.fallDeathZone, () => {
			this.startLevel();
		});
		this.physics.add.overlap(this.player, this.pixelGroup, (player, pixel) => {
			if (pixel.visible)
			{
				pixel.setVisible(false);
				this.playerPixels++;
				this.pixelHUDText.setText(this.playerPixels);
				this.sound.play("Collect Pixel");
			}
		});

		// Set main camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
		this.cameras.main.setDeadzone(50, 50);
		this.cameras.main.setZoom(this.SCALE);

		// Set HUD
		this.pixelHUDImage = this.add.sprite(610, 348, "Tilemap Transparent Spritesheet", 20);
		this.pixelHUDImage.setScrollFactor(0, 0);
		this.pixelHUDText = this.add.text(615, 348, this.playerPixels, {
			fontFamily: "Silkscreen"
		});
		this.pixelHUDText.setOrigin(0, 0.5);
		this.pixelHUDText.setScale(1/this.SCALE);
		this.pixelHUDText.setFontSize(25);
		this.pixelHUDText.setScrollFactor(0, 0);

		// Start level
		this.startLevel();
	}

	startLevel()
	{
		// Pixels
		this.playerPixels = 0;
		this.pixelHUDText.setText(this.playerPixels);
		for (let pixel of this.pixels)
		{
			pixel.setVisible(true);
		}
		
		// Player
		this.player.setPosition(0, 0);
		this.player.start();
	}

	update(time, delta)
	{
		this.player.update(delta);
	}
}