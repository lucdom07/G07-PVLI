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
    }
    create(){
        const playerTeam = [
            new Ally(this, -150, -150,'Michi-Michi', 30, 5, 0, 'pimiento', 0, 1, true, 1),
            new Ally(this, -150, -150,'trump', 25, 10, 0, 'pimiento', 0, 1, true, 1)
        ];
        
        // Enemigos disponibles
        const availableEnemies = [
            new Enemy(this, -150, -150,'pimiento', 28, 5, 0, 'pimiento', 0, 1),
            new Enemy(this, -150, -150,'pimiento', 22, 10, 0, 'pimiento', 0, 1),
            new Enemy(this, -150, -150,'pimiento', 35, 7, 0, 'pimiento', 0, 1)
        ];
        
        // Iniciar combate inmediatamente
        this.combatSystem.combat(playerTeam, availableEnemies)
    }
    update(time, dt){

    }
}