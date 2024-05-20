class Pixel extends Phaser.Physics.Arcade.Sprite
{
	// Variables
	#collected = false;
	#collectSound = null;


	// Methods
	constructor(scene, x, y)
	{
		super(scene, x, y, "Tilemap Transparent Spritesheet", 20);
		scene.add.existing(this);
		scene.physics.add.existing(this, true);

		this.setOrigin(0, 1);
		this.refreshBody();
		this.body.setSize(10, 10);

		return this;
	}

	start()
	{
		this.#collected = false;
		this.setVisible(true);
		this.anims.play("Pixel");
	}

	onPlayerCollide()
	{
		if (!this.#collected)
		{
			this.#collected = true;
			this.setVisible(false);
			this.scene.sound.play("Collect Pixel");
			
			this.scene.pixelHUDElement.increment();
		}
	}
}