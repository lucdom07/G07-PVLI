import { AudioFiles } from '../managers/audioConfig.js';
import GlobalObject from '../managers/globalObjects.js';
import Ally from '../../gameObjects/characters/ally.js';
import Enemy from '../../gameObjects/characters/enemy.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });

        this.progressBar = null;
        this.progressText = null;
    }
    
    preload() {
        //pantalla de carga
        this.createLoadingScreen();

        //cargar los recursos (json y musica)
        this.loadResources();

        //carga las texturas
        this.load.on('filecomplete-json-allyGroup', () => {
            this.loadAllyTexture();
        });
        
        this.load.on('filecomplete-json-objects', () => {
            this.loadObjectTexture();
        });

        this.load.on('filecomplete-json-enemyGroup', () => {
            this.loadEnemyTexture();
        });
        
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

    //enseña el boton para pasar de escena
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
    // crea la barra de progreso
    createLoadingScreen() {
        
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

    //Cargar todos los recursos
    loadResources(){
        //carga de los json
        this.load.json("allyGroup", "./jsons/allyGroup.json");
        this.load.json("enemyGroup", "./jsons/enemyGroup.json");
        this.load.json("objects", "./jsons/objects.json");

        // Cargar todas las músicas usando la configuración
        Object.entries(AudioFiles).forEach(([key, path]) => {
            this.load.audio(key, path);
        });
    }
    //carga las texturas de los aliados
    loadAllyTexture(){
        const allyData = this.cache.json.get("allyGroup");

        for(let i =0; i<4; i++){
            const groupKey = `ally${i}`;
            const group = allyData?.[groupKey];

            if(group){
                group.forEach(ally =>{
                    const textureKey = ally.name+"Texture";
                    
                    if (!this.textures.exists(textureKey)) {
                        this.load.image(textureKey, ally.texture);
                    }
                });
            }
        }
    }
    //carga las texturas de los enemigos
    loadEnemyTexture(){
        const enemyData = this.cache.json.get("enemyGroup");

        for(let i =0; i<4; i++){
            const groupKey = `enemy${i}`;
            const group = enemyData?.[groupKey];

            if(group){
                group.forEach(enemy =>{
                    if (!this.textures.exists(textureKey)) {
                        this.load.image(textureKey, enemy.texture);
                    }
                });
            }
        }
    }
    //carga las texturas de los objetos
    loadObjectTexture(){
        const objData = this.cache.json.get("objects");

        for(let i =0; i<4; i++){
            const groupKey = `objects${i}`;
            const group = objData?.[groupKey];
            if(group){
                group.forEach(obj =>{
                    const textureKey = obj.name+"Texture";
                    if (!this.textures.exists(textureKey)) {
                        this.load.image(textureKey, obj.texture);
                    }
                });
            }
        }
    }
}