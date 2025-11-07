import Ally from "../../gameObjects/characters/ally.js";
import GlobalAlly from "../managers/globalAlly.js";
import DOMmanager from "../managers/DOMManager.js";

export default class CombatSetup extends Phaser.Scene {

    constructor(DOMmanager) {
        super({key: 'combatSetup'});

        this.DOMmanager = DOMmanager;
        //Array con los aliados obtenidos
        this.ownedAllies = [];
        //Array con los aliados seleccionados
        this.selectedAllies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMallies = document.getElementById('alliesArray').children;
        //Posiciones de la fila de selección, con un booleano para saber si estan ocupadas
        this.positions = [[0, false], [1, false], [2, false], [3, false], [4, false]];
    }

    init(data) {
        //Array global con todos los aliados (desbloqueados o no)
        //this.globalAllies = data.allies;

        //Aún no está bien conectado al resto del juego
    }

    preload() {
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
        this.load.image('background','assets/background.png')
    }

    create() {

        this.add.image(450,340,'background');

        //Subscribir eventos de click a los aliados del DOM
        for(let i = 0; i < this.DOMallies.length; i++) {
            
            let index = i;
            let ally = this.DOMmanager.getArray()[i];
            this.DOMallies.item(i).addEventListener('click', () => {
                this.toggleAlly(ally, index);
                console.log(ally.getName());
            });
        }

        const playButton = this.add.image(200 ,50,'button').setInteractive();


        playButton.setPosition(450, 500);
  

        playButton.on('pointerdown',()=>{
            if(this.selectedAllies.length > 0 && this.selectedAllies.length === 3) {
                this.scene.start('debugCombat');
            }
        });

      //Código provisional hasta tener el resto de componentes del juego

        this.ownedAllies = [
            new GlobalAlly('pimiento', 'assets/pimiento.png'),
            new GlobalAlly('tortuga','assets/tortuga.png'),
            new GlobalAlly('chupacabra','assets/Chupacabra.png'),
            new GlobalAlly('perro','assets/Dog.png'),
            new GlobalAlly('foca','assets/Seal.png'),
            new GlobalAlly('warf','assets/Warf.png')
        ];
    }

    toggleAlly(ally) {
        if(ally.isOnTeam()) {
            this.removeAlly(ally);
        }
        else {
            this.addAlly(ally);
        }
    }

    /*
    Añade un aliado a selectedAllies, siempre que no estuviera ya añadido.

    FALTARIA PONER UN LIMITE AL MAXIMO DE ALIADOS
    */
    addAlly(ally) {
        //if(this.ownedAllies.find(x => x.getName() === ally.getName()) && 
            //  !this.selectedAllies.some(x => x.getName() === ally.getName())) {

        if(!this.selectedAllies.some(x => x.getName() === ally.getName())) {

            let i = 0;
            
            while(i < this.ownedAllies.length) {

                if(ally.getName() === this.ownedAllies[i].getName()) {

                    ally.toggleOnTeam();
                    let newAlly = ally.AllyFromGlobalAlly(this, 100 + i * 125, 300);
                    this.selectedAllies.push(newAlly); 
                    break;
                }
                i++;
            }
        }
    }

    /*
    Elimina un aliado de selectedAllies.

    FALTARIA QUE NO SE PUEDA ABNDONAR LA ESCENA CON 0 ALIADOS
    */
    removeAlly(ally) {
        let i = 0;
        let found = false;

        for(; i < this.selectedAllies.length; i++) {

            if(this.selectedAllies[i].getName() === ally.getName()) {
                found = true;
                break;
            }
        }

        if(found) {
            ally.toggleOnTeam();
            this.selectedAllies[i].destroy();
            this.selectedAllies.splice(i, 1);
            
        }
    }

}