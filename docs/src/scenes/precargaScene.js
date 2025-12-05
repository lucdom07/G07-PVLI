import { AudioFiles } from '../managers/audioConfig.js';
import GlobalObject from '../managers/globalObjects.js';
import Ally from '../../gameObjects/characters/ally.js';
import Enemy from '../../gameObjects/characters/enemy.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });

        this.progressBar = null;
        this.progressText = null;

        this.ally = {
            ally0:[], //australia
            ally1:[], //españa
            ally2:[], //china
            ally3:[]  //estados unidos
        }

        this.enemy = {
            enemy0:[], //au
            enemy1:[], //es
            enemy2:[], //ch
            enemy3:[]  //usa
        }

        this.objects = {
            objects0:[], //au
            objects1:[], //es
            objects2:[], //ch
            objects3:[]  //usa
        }
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
        //Aliados

        this.load.json("allyGroup", "./jsons/allyGroup.json");

        const rawData = this.cache.json.get("allyGroup");
        
        /*
        const dialogues = rawData.map(entry => new Dialogue(
            new Character(entry.name),
            entry.line,
            true
        ));
        this.dialogueManager = new DialogueManager(this, dialogues, {
            dialogBoxClass: DialogText
        });
        this.dialogueManager.start();
        */

    }
}