class TitleScreen extends Phaser.Scene
{
	// Constants
	SCALE = 3;

	// Input
	startKey = null;

	// Map
	map = null;
	tilesetImages = [];
	backgroundLayer = null;
	groundAndPlatformsLayer = null;
	decorationsLayer = null;
	
	// Game Objects
	start = null;

	// Text
	titleText = null;
	startText = null;
	START_TEXT_BLINK_DURATION = 1;
	startTextBlinkCounter = 0;


	// Methods
	constructor()
	{
		super("titleScreenScene");
	}

	create()
	{
		// Set input
		this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.startKey.on("down", (key, event) => {
			this.scene.start("level1Scene");
		});

		// Create map
		this.map = this.add.tilemap("Level 1 JSON", 16, 16, 120, 20);
		this.tilesetImages = [
			this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap Default Image"),
			this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "Tilemap Transparent Image")
		];
		this.backgroundLayer = this.map.createLayer("Background", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer = this.map.createLayer("Ground and Platforms", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer.setCollisionByExclusion([-1], true);
		this.decorationsLayer = this.map.createLayer("Decorations", this.tilesetImages, 0, 0);

		// Create start
		this.start = this.map.createFromObjects("Start and End", {
			name: "Start",
			key: "Tilemap Transparent Spritesheet",
			frame: 56
		})[0];

		// Create pixels
		for (let pixel of this.map.getObjectLayer("Pixels").objects) {
			let pixelInstance = new Pixel(this, pixel.x, pixel.y).start();
		}

		// Set main camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.start, true);
		this.cameras.main.setZoom(this.SCALE);

		// Create text
		this.titleText = this.add.text(this.cameras.main.x + this.cameras.main.displayWidth/2, this.cameras.main.y + this.cameras.main.displayHeight/2 - 35, "Obby\nBlobby", {
			fontFamily: "Silkscreen"
		});
		this.titleText.setOrigin(0.5, 0.5);
		this.titleText.setAlign("center");
		this.titleText.setScale(1/this.SCALE);
		this.titleText.setFontSize(75);

		this.startText = this.add.text(this.cameras.main.x + this.cameras.main.displayWidth/2, this.cameras.main.y + this.cameras.main.displayHeight/2 + 5, "(Press SPACE to start)", {
			fontFamily: "Silkscreen"
		});
		this.startText.setOrigin(0.5, 0.5);
		this.startText.setAlign("center");
		this.startText.setScale(1/this.SCALE);
		this.startText.setFontSize(15);
	}

	update(time, delta)
	{
		// Blink start text
		if (this.startTextBlinkCounter <= 0)
		{
			this.startText.setVisible(!this.startText.visible);
			this.startTextBlinkCounter = this.START_TEXT_BLINK_DURATION;
		}
		else
		{
			this.startTextBlinkCounter -= delta/1000;
			if (this.startTextBlinkCounter < 0) {
				this.startTextBlinkCounter = 0;
			}
		}
	}
}