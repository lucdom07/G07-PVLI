import CombatManager from "../managers/combatManager.js";
import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";

export default class Animation extends Phaser.Scene{
    constructor(){
        super({key: 'debugCombat'});
        this.ownedAllies = [];
        this.money = 0;
        this.playerTeam = [];
    }

    init(data){// se crea un CombatManager y se añaden las tropas aliadas pasadas desde combatSetup
        this.combatManager = new CombatManager(this);
        this.ownedAllies = data.ownedAllies;
        this.money = data.money;
        this.playerTeam = data.selectedAllies;
    }

    preload(){
        this.load.image('pimiento', 'assets/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/orange_miku_placeholder.png');
        this.load.image('foca','assets/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/garnet_miku_placeholder.png');
        this.load.image('background','assets/background.png')
    }

    create(){
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'background');

        //indica al combatManager que ya puede llamar al siguiente evento
        this.events.on('canCallNext',()=>{
            console.log("You can execute the next event");
            this.combatManager.canCallNext = true;
        });

        this.recreate();
        
        // Enemigos disponibles
        const enemyTeam = [
            new Enemy(this, -150, -150,"tortuga", 20, 5, 0, 'tortuga', 0, 1),
            new Enemy(this, -150, -150,"chupacabra", 21, 10, 0, 'chupacabra', 0, 1),
            new Enemy(this, -150, -150,"warf", 35, 7, 0, 'warf', 0, 1)
        ];
        
        //Inicializa el combate
        this.combatManager.initCombat(this.playerTeam, enemyTeam);
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
        this.combatManager.update(time, dt);
    }
}