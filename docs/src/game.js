import DebugCombat from './scenes/debugCombat.js'

let config = {
	type: Phaser.AUTO,
  	parent:'game',
	width:  900,
	height: 680,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		mode: Phaser.Scale.FIT,
        min:{
            width: 328,
            height: 188
        },
        max: {
            width: 900,
            height: 680
        },
        zoom: 1
	},
	scene: [DebugCombat],
	physics: { 
		default: 'arcade', 
		arcade: { 
			gravity: { y: 0}, 
			debug: true 
		}, 
	checkCollision:{
        up: true,
        down: true,
        left: true,
        right: true
    },
    },
	backgroundColor:'#2d2d2d'
};

new Phaser.Game(config);