
import Ally from "../../gameObjects/characters/ally.js";

/*
    Esta clase está destinada a guardar información de un objeto de tipo Ally, indepedientemente de su escena
*/
export default class GlobalAlly {

    constructor(name, texture, life = 0, range = 0, attack = 0, level = 0, frame = 0, cost = 0, available = 0) {
        this.name = name;
        this.texture = texture;
        this.life = life;
        this.range = range;
        this.attack = attack;
        this.level = level;
        this.frame = frame;
        this.cost = cost;
        this.available = available;
        this.onTeam = false;

        this.textureURLs = {
            'pimiento': '/assets/pimiento.png',
            'tortuga': '/assets/tortuga.png',
            'chupacabra': '/assets/Chupacabra.png',
            'perro': '/assets/Dog.png',
            'foca': '/assets/Seal.png',
            'warf': '/assets/Warf.png'
        };
    }

    getName() {
        return this.name;
    }

    getTextureURL() {
        return this.textureURLs[this.texture] || this.texture;
    }

    isOnTeam() {
        return this.onTeam;
    }

    toggleOnTeam() {
        if(this.onTeam) {
            this.onTeam = false;
        }
        else {
            this.onTeam = true;
        }
    }

    /*
    Devuelve un objeto de tipo Ally en base a este objeto (de tipo GlobalAlly) 

    HACER CON KEY DE TEXTURA
    */
    AllyFromGlobalAlly(scene, x, y) {
        return new Ally(scene, x, y, this.name, this.life, this.attack, this.range, this.texture, this.frame, this.cost, this.available, this.level);
    }
}