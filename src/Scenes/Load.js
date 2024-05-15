class Load extends Phaser.Scene {
	constructor()
	{
		super('loadScene')
	}

	preload()
	{
		// Load map
		/*
		this.load.path = './assets/Map/';
		this.load.image("Tilemap", "monochrome_tilemap_packed.png");
		this.load.tilemapTiledJSON("Level 1", "Level 1.tmj");
		*/

		// Load player
		this.load.path = './assets/Player/';
		this.load.image("Player 0", "0.png");
		this.load.image("Player 1", "1.png");
		this.load.image("Player 2", "2.png");
		this.load.image("Player 3", "3.png");
	}

	create()
	{
		// Create animations
		this.anims.create({
			key: "Player Idle",
			frames: [
				{ key: "Player 0" }
			],
			repeat: -1
		});
		this.anims.create({
			key: "Player Move",
			frames: [
				{ key: "Player 1" },
				{ key: "Player 2" },
				{ key: "Player 3" },
				{ key: "Player 0" }
			],
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "Player Jump",
			frames: [
				{ key: "Player 3" }
			],
			repeat: -1
		});

		// Start the first scene
		this.scene.start('level1Scene')
	}
}