import Combat from "../../gameObjects/combat.js";
import Ally from "../../gameObjects/ally.js";
import Enemy from "../../gameObjects/enemy.js";

export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
    }
    init(){
        this.combatSystem = new Combat(this);
    }
    preload(){
        
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
    }
    create(){
        const playerTeam = [
            new Ally(this, -150, -150,'Michi-Michi', 36, 20, 0, 'perro', 0, 1, true, 1),
            new Ally(this, -150, -150,'foca', 36, 20, 0, 'foca', 0, 1, true, 1),
            new Ally(this, -150, -150,'foca', 36, 20, 0, 'pimiento', 0, 1, true, 1)
        ];
        
        // Enemigos disponibles
        const availableEnemies = [
            new Enemy(this, -150, -150,'pimiento', 20, 5, 0, 'tortuga', 0, 1),
            new Enemy(this, -150, -150,'pimiento', 21, 10, 0, 'chupacabra', 0, 1),
            new Enemy(this, -150, -150,'pimiento', 35, 7, 0, 'warf', 0, 1)
        ];
        
        // Iniciar combate inmediatamente
        this.combatSystem.combat(playerTeam, availableEnemies)
    }
    update(time, dt){

    }
}