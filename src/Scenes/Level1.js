/* TODO:
	make transparent decorations appear again
	map text for game title, controls
*/

class Level1 extends Phaser.Scene
{
	// Constants
	SCALE = 3;
	WORLD_GRAVITY = 600;

	// Input
	moveLeftKey = null;
	moveRightKey = null;
	jumpKey = null

	// Map
	map = null;
	tilesetImages = [];
	backgroundLayer = null;
	groundAndPlatformsLayer = null;
	decorationsLayer = null;
	fallDeathZone = null;

	// Particles
	playerMoveParticles = null;
	playerJumpParticles

	// Game Objects
	start = null;
	end = null;
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
		this.tilesetImages = [
			this.map.addTilesetImage("monochrome_tilemap_packed", "Tilemap Default Image"),
			this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "Tilemap Transparent Image")
		];
		this.backgroundLayer = this.map.createLayer("Background", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer = this.map.createLayer("Ground and Platforms", this.tilesetImages, 0, 0);
		this.groundAndPlatformsLayer.setCollisionByExclusion([-1], true);
		this.decorationsLayer = this.map.createLayer("Decorations", this.tilesetImages, 0, 0);

		// Create fall death zone
		this.fallDeathZone = this.physics.add.staticSprite(this.map.widthInPixels/2, this.map.heightInPixels + 10/2)
		this.fallDeathZone.setSize(this.map.widthInPixels, 10);

		// Create particles
		this.playerMoveParticles = this.add.particles(0, 0, "Particles Multialtas", {
			frame: ["smoke_03.png", "smoke_06.png"],
			scale: {start: 0.01, end: 0.03},
			maxAliveParticles: 3,
			lifespan: 250,
			gravityY: -50,
			alpha: {start: 1, end: 0.1}
		});
		this.playerMoveParticles.stop();
		this.playerJumpParticles = this.add.particles(0, 0, "Particles Multialtas", {
			frame: "smoke_09.png",
			scale: {start: 0.01, end: 0.05},
			lifespan: 400,
			stopAfter: 1,
			gravityY: -50,
			alpha: {start: 1, end: 0.1}
		});
		this.playerJumpParticles.stop();

		// Create start and end
		this.start = this.map.createFromObjects("Start and End", {
			name: "Start",
			key: "Tilemap Transparent Spritesheet",
			frame: 56
		})[0];
		this.end = this.map.createFromObjects("Start and End", {
			name: "End",
			key: "Tilemap Transparent Spritesheet",
			frame: 58
		})[0];
		this.physics.world.enable(this.end, Phaser.Physics.Arcade.STATIC_BODY);
		const endBodyWidth = 2;
		const endBodyHeight = 2;
		this.end.body.setSize(endBodyWidth, endBodyHeight);
		this.end.body.setOffset(this.end.displayWidth - endBodyWidth, this.end.displayHeight/2);

		// Create pixels
		this.pixelGroup = this.physics.add.staticGroup();
		for (let pixel of this.map.getObjectLayer("Pixels").objects) {
			this.pixelGroup.add(new Pixel(this, pixel.x, pixel.y));
		}

		// Create enemies

		// Create player
		this.player = new Player(this, this.start.x, this.start.y);

		// Create colliders
		this.physics.add.collider(this.player, this.groundAndPlatformsLayer);
		this.physics.add.collider(this.player, this.fallDeathZone, () => {
			this.sound.play("Fall Death");
			this.startLevel();
		});
		this.physics.add.overlap(this.player, this.end, (player, end) => {
			this.sound.play("Victory");
			this.scene.start("victoryScene");
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
		//this.pixelHUDElement = new PixelHUDElement(this, (610*this.game.canvas.width)/1600, (348*this.game.canvas.height)/900);		// SCALE = 4
		this.pixelHUDElement = new PixelHUDElement(this, (550*this.game.canvas.width)/1600, (318*this.game.canvas.height)/900);			// SCALE = 3

		// Start level
		this.startLevel();

		// Make the player jump
		this.player.forceJump();
	}

	startLevel()
	{
		// Pixels
		for (let pixel of this.pixelGroup.getChildren()) {
			pixel.start();
		}
		
		// Player
		this.player.setPosition(this.start.x, this.start.y);
		this.player.start();

		// HUD
		this.pixelHUDElement.start();
	}

	update(time, delta)
	{
		this.player.update(delta);
	}
}