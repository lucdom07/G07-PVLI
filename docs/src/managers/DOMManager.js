import GlobalAlly from "../managers/globalAlly.js";

/*
    Esta clase está destinada a controlar el DOM en tiempo de ejecución
*/
export default class DOMmanager {

    constructor() {
        //Array con todos los aliados del juego (los aliados serán instancias de DomAlly)
        this.allies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMAllies = document.getElementById('alliesArray');
        //Array que contiene objetos de tipo DomAlly, para trackear los allies que se muestran en el DOM
        this.DOMAlliesArray = [];


        //Esta parte es provisional hasta que se tengan el resto de componentes del juego

        this.allies = [
            new GlobalAlly('pimiento', 'assets/pimiento.png',36,0,20,0,1,true),
            new GlobalAlly('tortuga','assets/tortuga.png',20,0,5,0,1,true),
            new GlobalAlly('chupacabra','assets/Chupacabra.png',21,0,10,0,1,true),
            new GlobalAlly('perro','assets/Dog.png',36,0,20,0,1,true),
            new GlobalAlly('foca','assets/Seal.png',36,0,20,0,1,true),
            new GlobalAlly('warf','assets/Warf.png',35,0,7,0,1,true)
        ];//nombre, textura,vida,rango, ataque,nivel, coste, avaible,
        
        //Cuando esté la tienda hecha habrá que cambiar esto

        this.allies.forEach(x => {
            this.addAlly(x);
        });
    }

    getArray() {
        return this.DOMAlliesArray;
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
