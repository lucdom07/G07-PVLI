import Ally from "../../gameObjects/characters/ally.js";

export default class CombatSetup extends Phaser.Scene {

    constructor() {
        super({key: 'combatSetup'});

        //Array con los aliados seleccionados
        this.selectedAllies = [];
    }

    init(data) {
        //Array global con todos los aliados (desbloqueados o no)
        this.globalAllies = data.allies;
    }

    preload() {
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
    }

    create() {
        const playerTeam = [
                    new Ally(this, -150, -150,'Michi-Michi', 36, 20, 0, 'perro', 0, 1, true, 1),
                    new Ally(this, -150, -150,'foca', 36, 20, 0, 'foca', 0, 1, true, 1),
                    new Ally(this, -150, -150,'foca', 36, 20, 0, 'pimiento', 0, 1, true, 1)
                ];
    }

    /*
    Añade un aliado a selectedAllies, siempre que no estuviera ya añadido.
    */
    addAlly(ally) {
        if(this.globalAllies.find(x => x.getName() === ally.getName()) && 
            !this.selectedAllies.some(x => x.getName() === ally.getName())) {

            this.selectedAllies.push(ally);
        }
    }

    /*
    Elimina un aliado de selectedAllies.
    */
    removeAlly(ally) {
        var i = 0;
        var found = false;

        for(elem of this.selectedAllies) {

            if(elem.getName() === ally.getName()) {
                found = true;
                break;
            }
            i++;
        }

        if(found) {
            this.selectedAllies.splice(i, 1);
        }
    }

}