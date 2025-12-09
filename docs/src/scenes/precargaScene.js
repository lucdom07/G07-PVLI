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

        //crea los gameobjects
        this.load.on('complete', () => {
        this.createGameObjects();
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
            allies:this.ally
            enemies:this.enemy
            objects: this.objects
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

    //Cargar todos los recursos
    loadResources(){
        // Cargar todas las músicas usando la configuración
        Object.entries(AudioFiles).forEach(([key, path]) => {
            this.load.audio(key, path);
        });

        // Cargar imágenes básicas (aliados, enemigos, fondos, etc)
        //Aliados

        this.load.json("allyGroup", "./jsons/allyGroup.json");
        this.load.json("enemyGroup", "./jsons/enemyGroup.json");
        this.load.json("objects", "./jsons/objects.json");
    }

    //obtiene del json un array específico de aliados
    getAllyGroup(num){
        const allyKey = `ally${num}`;
        const rawData = this.cache.json.get("allyGroup");

        if(rawData && rawData[allyKey]){
            return rawData[allyKey];
        }
        else return null;
    }

    //obtiene del json un array específico de enemigos
    getEnemyGroup(num){
        const allyKey = `enemy${num}`;
        const rawData = this.cache.json.get("enemyGroup");

        if(rawData && rawData[allyKey]){
            return rawData[allyKey];
        }
        else return null;
    }

    //obtiene del json un array específico de objetos
    getObjectGroup(num){
        const allyKey = `objects${num}`;
        const rawData = this.cache.json.get("objects");

        if(rawData && rawData[allyKey]){
            return rawData[allyKey];
        }
        else return null;
    }

    //Carga de grupos de aliados junto con sus texturas
    loadAllyGroups(){
        for(let i =0; i<4; i++){
            const groupToLoad = this.getAllyGroup(i);
            groupToLoad.forEach(ally => {
            this.load.image(ally.name + "Textura", ally.texture);
        });
        }

        for(let i = 0; i< 4; i++ ){
            const group = this.getAllyGroup(i);
            if(group){
                this.ally[`ally${i}`] = group.map(allyData =>{
                    return new Ally(
                        this,
                        -150,
                        -150,
                        allyData.name,
                        allyData.life,
                        allyData.attack,
                        allyData.range,
                        allyData.name+"Textura",
                        0,
                        allyData.cost,
                        false,
                        allyData.texture
                    )
                })
            }
        }
    }

    //Carga de grupos de enemigos junto con sus texturas
    loadEnemyGroups(){
        for(let i =0; i<4; i++){
            const groupToLoad = this.getEnemyGroup(i);
            groupToLoad.forEach(enemy => {
            this.load.image(enemy.name + "Textura", enemy.texture);
        });
        }

        for(let i = 0; i< 4; i++ ){
            const group = this.getEnemyGroup(i);
            if(group){
                this.enemy[`enemy${i}`] = group.map(enemyData =>{
                    return new Enemy(
                        this,
                        -150,
                        -150,
                        enemyData.name,
                        enemyData.life,
                        enemyData.attack,
                        enemyData.range,
                        enemyData.name+"Textura",
                        0,
                        enemyData.texture
                    )
                })
            }
        }
    }

    //Carga de grupos de objetos junto con sus texturas
    loadObjectGroups(){
        for(let i =0; i<4; i++){
            const groupToLoad = this.getObjectGroup(i);
            groupToLoad.forEach(objects => {
            this.load.image(objects.name + "Textura", objects.texture);
        });
        }

        for(let i = 0; i< 4; i++ ){
            const group = this.getObjectGroup(i);
            if(group){
                this.objects[`objects${i}`] = group.map(objectData =>{
                    return new GlobalObject(
                        this,
                        -150,
                        -150,
                        objectData.name,
                        objectData.texture,
                        objectData.life,
                        objectData.attack,
                        objectData.cost,
                        objectData.name+"Textura",
                        0
                    )
                })
            }
        }
    }

    //carga todos los gameObjects del juego
    createGameObjects(){
        this.loadAllyGroups();
        this.loadEnemyGroups();
        this.loadObjectGroups();
    }
}