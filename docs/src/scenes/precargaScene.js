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
        
        // Cargar imágenes básicas (aliados, enemigos, fondos, etc)

        this.load.on('complete',() =>{
            this.time.delayedCall(500,()=>{
                this.showPlayButton();
            })
        })
        
    }
    
    create() {
        
    }

    showPlayButton(){
        const button = this.add.text(this.cameras.main.width/2, this.cameras.main.height/2, 'Jugar').setPadding(32).setOrigin(0.5);

        button.setInteractive({useHandCursor: true});

        button.on('pointerover', () => {
            button.setBackgroundColor('#716970')
        })

        button.on('pointerout', () => {
            button.setBackgroundColor('#444545')
        })

        button.on('pointerdown', () => {
            this.scene.launch("mainMenu");
            this.scene.stop();
        })
    }
}