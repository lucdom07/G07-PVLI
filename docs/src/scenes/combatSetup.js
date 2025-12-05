import Ally from "../../gameObjects/characters/ally.js";
import DOMmanager from "../managers/DOMManager.js";

export default class CombatSetup extends Phaser.Scene {

    constructor(DOMmanager) {
        super({key: 'combatSetup'});

        this.DOMmanager = DOMmanager;
        this.playerData = {};
        //Array con los aliados seleccionados
        this.selectedAllies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMallies = document.getElementById('alliesArray');
    }

    init(data) {
        //Array global con todos los aliados (desbloqueados o no)
        //this.globalAllies = data.allies;
        this.playerData = data;
        //Aún no está bien conectado al resto del juego
    }

    preload() {
        this.load.image('pimiento', 'assets/placeholders/warriors/pepper_miku_placeholder.png');
        this.load.image('tortuga','assets/placeholders/warriors/green_miku_placeholder.png');
        this.load.image('chupacabra','assets/placeholders/warriors/dark_blue_miku_placeholder.png');
        this.load.image('perro','assets/placeholders/warriors/orange_miku_placeholder.png');
        this.load.image('foca','assets/placeholders/warriors/light_blue_miku_placeholder.png');
        this.load.image('warf','assets/placeholders/warriors/garnet_miku_placeholder.png');
        this.load.image('background','assets/placeholders/background.png')
        this.load.image('combatButton', 'assets/placeholders/buttons/combat_button.jpg')
    }

    create() {
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5,'background');

        //Subscribir eventos de click a los aliados del DOM
        
        const playButton = this.add.image(200 ,50,'combatButton').setInteractive();
        playButton.setPosition(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.8);
  
        //pasa los aliados al debugCombat
        playButton.on('pointerdown',()=>{
            if(this.selectedAllies.length > 0 && this.selectedAllies.length === 3) {
                this.scene.start('debugCombat',{
                    playerData: this.playerData,
                    selectedAllies: this.selectedAllies
                });
            }
        });

        //Código provisional hasta tener el resto de componentes del juego
      this.ownedAllies = [
            new Ally(this, -150, -150,'pimiento', 36, 20, 0, 'pimiento', 0, 1, false, 0),
            new Ally(this, -150, -150,'tortuga', 20, 5, 0, 'tortuga', 0, 1, false, 0),
            new Ally(this, -150, -150,'chupacabra', 21, 10, 0, 'chupacabra', 0, 1, false, 0),
            new Ally(this, -150, -150,'warf', 35, 7, 0, 'warf', 0, 1, false, 0)
        ];

        this.DOMmanager.inicializa(this.ownedAllies);
        
        [...this.DOMallies.children].forEach(x => {
            this.makeClickable(x);
        });
    }

    /*
    Añade un aliado a selectedAllies, siempre que no estuviera ya añadido.
    */
    addAlly(ally) {
        if (this.selectedAllies.length >= 3 || this.selectedAllies.some(x => x === ally)) {
            return;
        }
        this.selectedAllies.push(ally);
        this.repositionSelectedAllies();
    }

    /*
    Elimina un aliado de selectedAllies.
    */
    removeAlly(ally) {
        const index = this.selectedAllies.indexOf(ally);
        if(index != -1) {
            this.selectedAllies.splice(index, 1);
            ally.x = -150;
            ally.y = -150;
            this.repositionSelectedAllies();   
        }
    }

    repositionSelectedAllies() {
        const startX = 350;
        const y = 300;
        const separation = 125;

        this.selectedAllies.forEach((ally, index) => {
            // usa setPosition si es un GameObject de Phaser
            if (typeof ally.setPosition === "function") {
                // animación opcional: tween en lugar de salto directo
                const newX = startX - index * separation;

            // mover el aliado
            ally.setWarriorPosition(newX, y);

            } else {
                // fallback si no tiene setPosition
                ally.x = startX - index * separation;
                ally.y = y;
            }
        });
    }

    toggleAlly(domAlly) {
        const ally = this.ownedAllies.find(x => x.name === domAlly.dataset.name);
        if(!ally) return;

        if(this.selectedAllies.includes(ally)) {
            this.removeAlly(ally);
        }
        else {
            this.addAlly(ally);
        }
    }

    // Hace un aliado del DOM clickeable
    makeClickable(domAlly) {
        domAlly.addEventListener('click', () => {
            this.toggleAlly(domAlly);
            console.log(domAlly.dataset.name);
        });
    }
}