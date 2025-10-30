import Ally from "../../gameObjects/ally";

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

    }

    create() {
        
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