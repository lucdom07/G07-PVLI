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
        
        let imagen = this.load.image('pimiento', 'assets/pimiento.png');
        imagen.width = 20;
        imagen.height = 20;
    }
    create(){
        const playerTeam = [
            new Ally(this, 0, 0,'Michi-Michi', 30, 10, 0, imagen, 0, 1, true, 1),
            new Ally(this, 0, 0,'trump', 25, 12, 1, imagen, 0, 1, true, 1)
        ];
        
        // Enemigos disponibles simples
         const availableEnemies = [
            { x: 0, y: 0, life: 28, attack: 8, range: 0, texture: imagen, frame: 0 },
            { x: 0, y: 0, life: 22, attack: 15, range: 0, texture: imagen, frame: 0 },
            { x: 0, y: 0, life: 35, attack: 7, range: 0, texture: imagen, frame: 0 }
        ];
        
        // Iniciar combate inmediatamente
        this.combatSystem.combat(playerTeam, availableEnemies)
    }
    update(time, dt){

    }
}