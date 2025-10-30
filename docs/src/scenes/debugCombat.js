import Combat from "../../gameObjects/combat";
import Ally from "../../gameObjects/ally";
import Enemy from "../../gameObjects/enemy";

export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
    }
    init(){
        this.combatSystem = new Combat(this);
    }
    preload(){
        this.load.image('pimiento', '../../assets/pimiento.png');
        this.load.image('pimiento', '../../assets/pimiento.png');
    }
    create(){
        const playerTeam = [
            new Ally(this, 0, 0, 30, 10, 0, 'ally', 0, 1, true, 1),
            new Ally(this, 0, 0, 25, 12, 1, 'ally', 0, 1, true, 1)
        ];
        
        // Enemigos disponibles simples
        const availableEnemies = [
            new Enemy(this, 0, 0, 28, 8, 0, 'enemy', 0),
            new Enemy(this, 0, 0, 22, 15, 0, 'enemy', 0)
        ];
        
        // Iniciar combate inmediatamente
        this.combatSystem.startCombat(playerTeam, availableEnemies)
            .then(playerWon => {
                this.add.text(400, 300, playerWon ? '¡VICTORIA!' : 'DERROTA', {
                    fontSize: '48px',
                    fill: playerWon ? '#00ff00' : '#ff0000'
                }).setOrigin(0.5);
            });
    }
    update(time, dt){

    }
}