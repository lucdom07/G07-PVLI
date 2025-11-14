import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class debugMarket extends Phaser.Scene{
       constructor(){
            super({key: 'debugMap'});
            //Array con los aliados obtenidos
            this.ownedAllies = [];
            this.money = 0;
        }

        //En init le pasamos los aliados y el dinero que tiene el jugador para que cuando entre en una sala se lo pueda pasar a la siguiente escena
        init(data){
            this.ownedAllies = data.ownedAllies;
            this.money = data.money;
        }
    
        preload(){
            this.load.image('combatButton','assets/combat_button.jpg');
            this.load.image('background','assets/background.jpg');
        }
    
        create(){    
            this.add.image(450,340,'background');
            const combatButton = this.add.image(300,100,'combatButton').setInteractive();
    
            combatButton.setPosition(600,500);
    
            combatButton.on('pointerdown', () =>{        
                this.scene.start('combatSetup',{
                    ownedAllies: this.ownedAllies,
                    money: this.money
                });
                console.log("Saliendo del mapa");
            });
        }
}