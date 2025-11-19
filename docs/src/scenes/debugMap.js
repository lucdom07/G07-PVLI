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
            this.load.image('aaa','assets/aaa.png');
        }
    
        create(){    
            this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'aaa');
            const combatButton = this.add.image(300,100,'combatButton').setInteractive();
    
            combatButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
    
            combatButton.on('pointerdown', () =>{        
                this.scene.start('combatSetup',{
                    ownedAllies: this.ownedAllies,
                    money: this.money
                });
                console.log("Saliendo del mapa");
            });
        }
}