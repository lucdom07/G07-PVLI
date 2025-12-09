import DebugMap from './scenes/debugMap.js';
import DebugCombat from './scenes/debugCombat.js';
import MainMenu from './scenes/mainMenu.js';
import DebugMarket from './scenes/debugMarket.js';
import CombatSetup from './scenes/combatSetup.js';
import DOMmanager from "./managers/DOMManager.js";
import IntroductionScene from './scenes/introductionScene.js';
import AustraliaScene from './scenes/australiaScene.js';
import PauseMenu from './scenes/pauseMenu.js';
import marketDialogueScene from './scenes/marketDialogueScene.js';
import BootScene from './scenes/precargaScene.js';

window.addEventListener('DOMContentLoaded', () => {
	
	const DOManager = new DOMmanager();
	
	let config = {
		type: Phaser.AUTO,
		parent:'game',
		width:  1100,
		height: 620,
		scale: {
			autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
			mode: Phaser.Scale.FIT,
			min:{
				width: 328,
				height: 188
			},
			max: {
				width: 1100,
				height: 620
			},
			zoom: 1
		},
		scene: [
			BootScene,
			MainMenu,
			DebugMap,
			DebugCombat,
			DebugMarket,
			new CombatSetup(DOManager),
			IntroductionScene,
			AustraliaScene,
			PauseMenu,
			marketDialogueScene
		],
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
});
