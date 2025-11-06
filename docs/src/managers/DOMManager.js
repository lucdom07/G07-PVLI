import DomAlly from "./domAlly.js";

/*
    Esta clase está destinada a controlar el DOM en tiempo de ejecución
*/
export default class DOMManager {

    constructor() {
        //Array con todos los aliados del juego (los aliados serán instancias de DomAlly)
        this.allies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMAllies = document.getElementById('alliesArray');
        //Array que contiene objetos de tipo DomAlly, para trackear los allies que se muestran en el DOM
        this.DOMAlliesArray = [];

        //Esta parte es provisional hasta que se tengan el resto de componentes del juego

        this.allies = [
            new DomAlly('pimiento', 'assets/pimiento.png'),
            new DomAlly('tortuga','assets/tortuga.png'),
            new DomAlly('chupacabra','assets/Chupacabra.png'),
            new DomAlly('perro','assets/Dog.png'),
            new DomAlly('foca','assets/Seal.png'),
            new DomAlly('warf','assets/Warf.png')
        ];
        
        //Cuando esté la tienda hecha habrá que cambiar esto por un click event

        this.allies.forEach(x => {
            this.addAlly(x);
        });

        console.log(this.DOMAllies);
    }

    /*
    Añade un DomAlly a DOMAllies y DOMAlliesArray
    */
    addAlly(ally) {
        let elem = this.allies.find(x => ally.getName() === x.getName());
        if(elem != undefined) {
            const div = document.createElement('div');
            const img = document.createElement('img');

            img.src = elem.getTextureURL();
            img.className = 'domAlly';

            this.DOMAllies.appendChild(div);
            div.appendChild(img);
            this.DOMAlliesArray.push(elem);
        }
    }
}
