import CombatManager from "../managers/combatManager.js";
import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";
import { DialogueKeys } from "../managers/dialogueConfig.js";

import cargaGameObject from "../managers/cargaGameObjects.js";

export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
        this.playerData = {};
        this.playerTeam = [];
        this.audioManager = null;

        this.mapMusic = [MusicKeys.AU, MusicKeys.ES, MusicKeys.CH, MusicKeys.USA];
        this.victoryDialoguesMusic = [MusicKeys.AUSTRALIA_VICTORY, MusicKeys.SPAIN_VICTORY, MusicKeys.CHINA_VICTORY, MusicKeys.ENDING];
        this.cargaManagerEnemigos = null;
        this.enemyGroup =[];
        this.enemyToCombat =[];
        this.backgrounds = ['austCombat', 'spainCombat',  'chinaCombat', 'usaCombat'];
    }

    init(data){// se crea un CombatManager y se añaden las tropas aliadas pasadas desde combatSetup
        this.combatManager = new CombatManager(this),
        this.playerData = data.playerData,
        this.playerTeam = data.selectedAllies,
        this.bossFlag = data.bossFlag,
        this.world = data.world
    }

    preload(){
        //Backgrounds
        this.load.image('austCombat','assets/backgrounds/australiaCombat.png');
        this.load.image('chinaCombat','assets/backgrounds/chinaCombat.png');
        this.load.image('spainCombat','assets/backgrounds/spainCombat.png');
        this.load.image('usaCombat','assets/backgrounds/usaCombat.png');
        this.load.image('combatBackground','assets/backgrounds/australiaCombat.png')
        this.load.image('exit','assets/placeholders/buttons/exit_button.png');
    }

    create(){
        console.log("initial money: ", this.playerData.money);
        this.cargaManagerEnemigos = new cargaGameObject(this,this.playerData.level);
        this.enemyGroup = this.cargaManagerEnemigos.loadEnemyGroups();

        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.BATALLA);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, this.backgrounds[this.world]);

        //indica al combatManager que ya puede llamar al siguiente evento
        this.events.on('canCallNext',()=>{
            console.log("You can execute the next event");
            this.combatManager.canCallNext = true;
        });
        this.events.on('allyDamageSound', ()=>{
            this.audioManager.playSound(MusicKeys.ALLY_DAMAGE);
        })

        this.recreate();
        
        //añadir un if si se trata del combate con el boss o es normal
        this.createEnemyTeam();
        
        //Inicializa el combate
        this.combatManager.initCombat(this.playerTeam, this.enemyToCombat);
    }
//recrea los aliados en esta escena con las mismas propiedades
    recreate() { 
        const recreatedAllies = [];
        
        this.playerTeam.forEach((allyData, index) => {
            const newAlly = new Ally(
                this, 
                100 + index * 125, 
                300,
                allyData.name,
                allyData.life,
                allyData.attack,
                allyData.range,
                allyData.texture+"Texture",
                allyData.frame,
                allyData.cost,
                allyData.available,
                allyData.texture
            );
            recreatedAllies.push(newAlly);
        });
        
        this.playerTeam = recreatedAllies;
    }
    showExitButton(){
        if (!this.combatManager.victory){
            this.audioManager.playMusic(MusicKeys.GAME_OVER);
        }
        console.log("you can exit combat");
        const exitButton = this.add.image(200 ,50,'exit').setInteractive();

        exitButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
  
        //pasa los aliados al debugCombat
        exitButton.on('pointerdown',()=>{
            console.log("boss" + this.bossFlag);
            if(this.combatManager.victory) {
                if(!this.bossFlag) {
                    this.playerData.money += 10;
                    console.log("new money: ", this.playerData.money);
                    this.scene.stop();
                    this.audioManager.playMusic(this.mapMusic[this.world]);
                    this.scene.resume('debugMap');
                }
                else {
                    this.audioManager.playMusic(this.victoryDialoguesMusic[this.world]);
                    this.playerData.level++;
                    this.playerData.money += 10;
                    console.log("new money: ", this.playerData.money);
                    this.world += 1;
                    this.playerData.world = this.world;
                    this.bossFlag = false;
                    this.startVictoryDialogue();
                }
            }
            else {
                const sceneManager = this.sys.game.scene;

                // Detener TODAS las escenas excepto MainMenu
                sceneManager.getScenes(true).forEach(scene => {
                    if(scene.scene.key !== 'mainMenu') sceneManager.stop(scene.scene.key);
                    
                });

                sceneManager.getScenes(false).forEach(scene => {
                    if(scene.scene.key !== 'mainMenu') sceneManager.stop(scene.scene.key);
                });

                // Detener el menú de pausa
                this.scene.stop();
                this.scene.stop('debugMap');
                // Iniciar MainMenu
                sceneManager.start('mainMenu', { reset: true });
            }
        });
    }
    update(time, dt){
        this.combatManager.update(time, dt);
    }

    //crea la array de enemigos para el combate
    createEnemyTeam() {
        this.enemyToCombat = [];
        
        const playerTeamSize = this.playerTeam.length; //tamaño de la array del aliado
        
        if (this.enemyGroup.length-1 === 0) {
            console.error("No hay enemigos disponibles en enemyGroup");
            return this.enemyToCombat;
        }
        
        const teamSize = Math.min(playerTeamSize, this.enemyGroup.length-1);
        
        //sin repetición
        if (teamSize <= this.enemyGroup.length-1) {
            const availableEnemies = [...this.enemyGroup];
            
            for (let i = 0; i < teamSize; i++) {
                //indice aleatorio
                const randomIndex = Math.floor(Math.random() * availableEnemies.length-1);
                
                const selectedEnemy = availableEnemies.splice(randomIndex, 1)[0];
                const enemyClone = this.cloneEnemy(selectedEnemy);
                this.enemyToCombat.push(enemyClone);
            }
        } else {
            // con repeticiones         
            for (let i = 0; i < teamSize; i++) {
                const randomIndex = Math.floor(Math.random() * this.enemyGroup.length-1);
                const selectedEnemy = this.enemyGroup[randomIndex];
                const enemyClone = this.cloneEnemy(selectedEnemy);
                this.enemyToCombat.push(enemyClone);
            }
        }
        return this.enemyToCombat;
    }

    //clona el enemigo para el array de enemigos a combatir
    cloneEnemy(originalEnemy) {
        return new Enemy(
            this, 
            -150,
            -150,
            originalEnemy.name,
            originalEnemy.life,
            originalEnemy.attack,
            originalEnemy.range,
            originalEnemy.texture+"Texture",
            originalEnemy.frame || 0,
            originalEnemy.texture
        );
    }

    //crea el equipo del boss
    createBossTeam(){
        this.enemyToCombat = [];
        
        if (this.enemyGroup.length === 0) {
            console.error("No hay enemigos disponibles en enemyGroup");
            return this.enemyToCombat;
        }
        
        //mete al boss a la array
        const bossClone = this.cloneEnemy(this.enemyGroup[this.enemyGroup.length - 1]);
        this.enemyToCombat.push(bossClone);

        //lista de enemigos sin el boss
        const availableEnemies = this.enemyGroup.slice(0, -1);

        const numberOfMinions = Math.min(3, availableEnemies.length);

        //sin repetición, genera 3 enemigos aleatorios
        for (let i = 0; i < numberOfMinions; i++) {
            //indice aleatorio
            const randomIndex = Math.floor(Math.random() * availableEnemies.length);
            
            const selectedEnemy = availableEnemies.splice(randomIndex, 1)[0];
            const enemyClone = this.cloneEnemy(selectedEnemy);
            this.enemyToCombat.push(enemyClone);
        }
        
        return this.enemyToCombat;
    }
    
    startVictoryDialogue(){

        const worldDialogues = {
            1: DialogueKeys.AU,
            2: DialogueKeys.ES,
            3: DialogueKeys.CH,
            4: DialogueKeys.ENDING
        }

        const dialogueKey = worldDialogues[this.world];
        if(!dialogueKey){ 
            console.error("no hay dialogue.key: ", this.world);
            return;

        }
        let nextScene = null;

        if(this.world < 4){
            nextScene = 'debugMap';
        }
        else nextScene = 'mainMenu';

        this.scene.start('DialogueScene',{
            dialogueKey: dialogueKey,
            returnScene: null,
            nextScene: nextScene,
            playerData: this.playerData
        });
        this.scene.stop();
    }
}