import { AudioFiles } from '../managers/audioConfig.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Cargar todas las músicas usando la configuración
        Object.entries(AudioFiles).forEach(([key, path]) => {
            this.load.audio(key, path);
        });
        
        // Cargar imágenes básicas si son necesarios por aca
        
    }
    
    create() {
        this.scene.start('mainMenu');
    }
}