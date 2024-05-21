class Load extends Phaser.Scene
{
	constructor()
	{
		super('loadScene')
	}

	preload()
	{
		// Set load path
		this.load.path = './assets/';

		// Load particles
		this.load.multiatlas("Particles Multialtas", "kenny-particles.json");

		// Load default and transparent tilemaps
		this.load.image("Tilemap Default Image", "monochrome_tilemap_packed.png");
		this.load.image("Tilemap Transparent Image", "monochrome_tilemap_transparent_packed.png");
		this.load.tilemapTiledJSON("Level 1 JSON", "Level 1.tmj");
		this.load.spritesheet("Tilemap Transparent Spritesheet", "monochrome_tilemap_transparent_packed.png", {
			frameWidth: 16,
			frameHeight: 16
		});

		// Load audio
		this.load.audio("Fall Death", "Fall Death.wav");
		this.load.audio("Victory", "Victory.wav");
		this.load.audio("Collect Pixel", "Collect Pixel.wav");
		this.load.audio("Player Jump", "Player Jump.wav");
	}

	create()
	{
		// Create animations
		this.anims.create({
			key: "Pixel",
			frameRate: 3,
			repeat: -1,
			frames: [
				{ key: "Tilemap Transparent Spritesheet", frame: 20 },
				{ key: "Tilemap Transparent Spritesheet", frame: 21 },
			]
		});
		this.anims.create({
			key: "Player Idle",
			repeat: -1,
			frames: [{ key: "Tilemap Transparent Spritesheet", frame: 261 }]
			/*
			frames: this.anims.generateFrameNumbers("Tilemap Transparent Spritesheet", {
				start: 261,
				end: 261
			})
			*/
		});
		this.anims.create({
			key: "Player Move",
			frameRate: 18,
			repeat: -1,
			frames: [
				{ key: "Tilemap Transparent Spritesheet", frame: 262 },
				{ key: "Tilemap Transparent Spritesheet", frame: 263 },
				{ key: "Tilemap Transparent Spritesheet", frame: 264 },
				{ key: "Tilemap Transparent Spritesheet", frame: 264 },
				{ key: "Tilemap Transparent Spritesheet", frame: 263 },
				{ key: "Tilemap Transparent Spritesheet", frame: 262 },
				{ key: "Tilemap Transparent Spritesheet", frame: 261 }
			]
		});
		this.anims.create({
			key: "Player Jump",
			repeat: -1,
			frames: [{ key: "Tilemap Transparent Spritesheet", frame: 264 }]
		});

		// Start the first scene
		this.scene.start("titleScreenScene")
	}
}