// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    fps: { forceSetTimeOut: true, target: 60 },
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 600,
    height: 800,
    autoCenter: true,
    scene: [Game]
}

const game = new Phaser.Game(config);