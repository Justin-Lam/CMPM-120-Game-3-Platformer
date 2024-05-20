class PixelHUDElement
{
	// Variables
	#pixels = 0;
	#image = null;
	#text = null;


	// Methods
	constructor(scene, x, y)
	{
		// Create image
		this.#image = scene.add.sprite(x, y, "Tilemap Transparent Spritesheet", 20);
		this.#image.setScrollFactor(0, 0);

		// Create text
		this.#text = scene.add.text(x + 4, y + 1, this.#pixels, {
			fontFamily: "Silkscreen"
		});
		this.#text.setOrigin(0, 0.5);
		this.#text.setScale(1/scene.SCALE);
		this.#text.setFontSize(20);
		this.#text.setScrollFactor(0, 0);

		// Return instance
		return this;
	}

	start()
	{
		this.#pixels = 0;
		this.#text.setText(this.#pixels);
	}

	increment()
	{
		this.#pixels++;
		this.#text.setText(this.#pixels);
	}
}