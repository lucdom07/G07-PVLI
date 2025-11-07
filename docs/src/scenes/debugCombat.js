import CombatManager from "../managers/combatManager.js";
import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";


export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
    }
    init(data){
        this.combatManager = new CombatManager(this);

        this.playerTeam = data.selectedAllies || [];

        console.log("recividos: " + this.playerTeam);
    }
    preload(){
        
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
        this.load.image('background','assets/background.png')
    }
    create(){
            this.add.image(450,340,'background');

        if(this.playerTeam.length === 0){
            this.playerTeam = [
            new Ally(this, -150, -150,"Michi-Michi", 36, 20, 0, 'perro', 0, 1, true, 1),
            new Ally(this, -150, -150,"foca", 36, 20, 0, 'foca', 0, 1, true, 1),
            new Ally(this, -150, -150,"pimiento", 36, 20, 0, 'pimiento', 0, 1, true, 1)
        ]; //scene, x, y, name, life, attack, range, texture, frame, cost, available, level
        }
        else {
            this.recreate();
        }
        
        
        
        // Enemigos disponibles
        const enemyTeam = [
            new Enemy(this, -150, -150,"tortuga", 20, 5, 0, 'tortuga', 0, 1),
            new Enemy(this, -150, -150,"chupacabra", 21, 10, 0, 'chupacabra', 0, 1),
            new Enemy(this, -150, -150,"warf", 35, 7, 0, 'warf', 0, 1)
        ];
        
        // Iniciar combate inmediatamente
        this.combatManager.combat(this.playerTeam, enemyTeam)
    }

     recreate() {
        const recreatedAllies = [];
        
        this.playerTeam.forEach((allyData, index) => {
            // Crear nuevo aliado en esta escena con las mismas propiedades
            const newAlly = new Ally(
                this, 
                100 + index * 125, 
                300,
                allyData.name,
                allyData.life,
                allyData.attack,
                allyData.range,
                allyData.texture,
                allyData.frame,
                allyData.cost,
                allyData.available,
                allyData.level
            );
            recreatedAllies.push(newAlly);
        });
        
        this.playerTeam = recreatedAllies;
    }
    update(time, dt){

    }
}