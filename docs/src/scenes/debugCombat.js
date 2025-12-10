import CombatManager from "../managers/combatManager.js";
import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

import AudioManager from "../managers/audioManager.js";
import { MusicKeys } from "../managers/audioConfig.js";

import cargaGameObject from "../managers/cargaGameObjects.js";

export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
        this.playerData = {};
        this.audioManager = null;

        this.cargaManagerEnemigos = null;
        this.enemyGroup =[];
        this.enemyToCombat =[];
    }

    init(data){// se crea un CombatManager y se añaden las tropas aliadas pasadas desde combatSetup
        this.combatManager = new CombatManager(this);
        this.playerData = data.playerData;
        this.playerTeam = data.selectedAllies;
    }

    preload(){
        this.load.image('pimiento', 'assets/placeholders/warriors/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/placeholders/warriors/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/placeholders/warriors/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/placeholders/warriors/orange_miku_placeholder.png');
        this.load.image('foca','assets/placeholders/warriors/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/placeholders/warriors/garnet_miku_placeholder.png');
        this.load.image('combatBackground','assets/backgrounds/australiaCombat.png')
    }

    create(){
        this.cargaManagerEnemigos = new cargaGameObject(this,this.playerData.level);
        this.enemyGroup = this.cargaManagerEnemigos.loadEnemyGroups();

        console.log(this.enemyGroup);

        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.audioManager = AudioManager.getInstance(this);
        this.audioManager.playMusic(MusicKeys.BATALLA);

        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'combatBackground');

        //indica al combatManager que ya puede llamar al siguiente evento
        this.events.on('canCallNext',()=>{
            console.log("You can execute the next event");
            this.combatManager.canCallNext = true;
        });
        this.events.on('allyDamageSound', ()=>{
            this.audioManager.playSound(MusicKeys.ALLY_DAMAGE);
        })

        this.recreate();
        
        this.createEnemyTeam();

        // Enemigos disponibles
        const enemyTeam = [
            new Enemy(this, -150, -150,"tortuga", 20, 5, 0, 'tortuga', 0, 1),
            new Enemy(this, -150, -150,"chupacabra", 21, 10, 0, 'chupacabra', 0, 1),
            new Enemy(this, -150, -150,"warf", 35, 7, 0, 'warf', 0, 1)
        ];
        
        
        //Inicializa el combate
        this.combatManager.initCombat(this.playerTeam, this.enemyToCombat);

        // Botón de pausa
        this.pauseButton = this.add.text(100, 40, "Pause", {
            fontSize: "20px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        
        this.pauseButton.on("pointerdown", () => {
            this.scene.launch('pauseMenu',{pausedSceneKey : this.sys.settings.key});
            this.scene.pause();
        });



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
    update(time, dt){
        this.combatManager.update(time, dt);
    }

    //crea la array de enemigos para el combate
    createEnemyTeam() {
        // Limpiar el array de enemigos para combate
        this.enemyToCombat = [];
        
        // Determinar el tamaño del equipo enemigo basado en los aliados del jugador
        const playerTeamSize = this.playerTeam.length;
        
        // Validar que hay suficientes enemigos disponibles
        if (this.enemyGroup.length === 0) {
            console.error("No hay enemigos disponibles en enemyGroup");
            return this.enemyToCombat;
        }
        
        const teamSize = Math.min(playerTeamSize, this.enemyGroup.length);
        
        // Array de enemigos sin repetición
        if (teamSize <= this.enemyGroup.length) {
            // Copia array de enemigos del original
            const availableEnemies = [...this.enemyGroup];
            
            // Seleccionar enemigos aleatorios sin repetición
            for (let i = 0; i < teamSize; i++) {
                // Seleccionar un índice aleatorio
                const randomIndex = Math.floor(Math.random() * availableEnemies.length);
                
                // Obtener el enemigo y removerlo del array disponible
                const selectedEnemy = availableEnemies.splice(randomIndex, 1)[0];
                
                // Clonar el enemigo para no modificar el original en enemyGroup
                // y ajustar su posición inicial
                const enemyClone = this.cloneEnemy(selectedEnemy);
                this.enemyToCombat.push(enemyClone);
            }
        } else {
            // repeticiones si no hay unicos            
            for (let i = 0; i < teamSize; i++) {
                const randomIndex = Math.floor(Math.random() * this.enemyGroup.length);
                const selectedEnemy = this.enemyGroup[randomIndex];
                
                // Clonar el enemigo
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

}
