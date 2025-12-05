import { AudioFiles } from '../managers/audioConfig.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });

        this.progressBar = null;
        this.progressText = null;
    }
    
    preload() {
        //pantalla de carga
        this.createLoadingScreen();

        //cargar los recursos
        this.loadResources();

        //eventos de carga
         this.load.on('progress', (value) => {
            const percent = Math.floor(value * 100);
            this.progressBar.width = 296 * value;
            this.progressText.setText(`${percent}%`);
        });
    }
    
    create() {
        this.progressBar.setVisible(false);
        this.progressText.setVisible(false);
        this.showPlayButton();
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

    createLoadingScreen() {
        // Barra de progreso
        const barWidth = 300;
        const barHeight = 20;
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;

        // Barra de progreso
        this.progressBar = this.add.rectangle(
            x - barWidth / 2, 
            y, 
            0, 
            barHeight - 4, 
            0x00ff00
        ).setOrigin(0, 0.5);
        
        // Texto de porcentaje
        this.progressText = this.add.text(x, y, '0%', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    loadResources(){
        // Cargar todas las músicas usando la configuración
        Object.entries(AudioFiles).forEach(([key, path]) => {
            this.load.audio(key, path);
        });

        // Cargar imágenes básicas (aliados, enemigos, fondos, etc)
    }
}