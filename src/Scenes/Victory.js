class Victory extends Phaser.Scene
{
	// Input
	restartKey = null;

	// Text
	congratulationsText = null;
	returnText = null;
	CONGRATULATIONS_TEXT_BLINK_DURATION = 0.5;
	congratulationsTextBlinkCounter = 0;

	constructor()
	{
		super("victoryScene");
	}

	create()
	{
		// Set input
		this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.restartKey.on("down", (key, event) => {
			this.scene.start("titleScreenScene");
		});

		// Create text
		this.congratulationsText = this.add.text(game.config.width/2, game.config.height/2 - 50, "Congratulations on completing Obby Blobby!", {
			fontFamily: "Silkscreen",
			wordWrap: {
				width: this.game.config.width - 100
			}
		});
		this.congratulationsText.setOrigin(0.5, 0.5);
		this.congratulationsText.setAlign("center");
		this.congratulationsText.setFontSize(50);

		this.returnText = this.add.text(game.config.width/2, game.config.height/2 + 50, "(Press SPACE to return to title screen)", {
			fontFamily: "Silkscreen"
		});
		this.returnText.setOrigin(0.5, 0.5);
		this.returnText.setAlign("center");
		this.returnText.setFontSize(15);
	}

	update(time, delta)
	{
		// Blink congraulations text
		if (this.congratulationsTextBlinkCounter <= 0)
		{
			this.congratulationsText.setVisible(!this.congratulationsText.visible);
			this.congratulationsTextBlinkCounter = this.CONGRATULATIONS_TEXT_BLINK_DURATION;
		}
		else
		{
			this.congratulationsTextBlinkCounter -= delta/1000;
			if (this.congratulationsTextBlinkCounter < 0) {
				this.congratulationsTextBlinkCounter = 0;
			}
		}
	}
}