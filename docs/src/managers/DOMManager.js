import GlobalAlly from "../managers/globalAlly.js";

/*
    Esta clase está destinada a controlar el DOM en tiempo de ejecución
*/
export default class DOMmanager{

    constructor() {
        //Array con todos los aliados del juego (los aliados serán instancias de DomAlly)
        this.allies = [];
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMAllies = document.getElementById('alliesArray');
        //Array que contiene objetos de tipo DomAlly, para trackear los allies que se muestran en el DOM
        this.DOMAlliesArray = [];

        //Esta parte es provisional hasta que se tengan el resto de componentes del juego
        this.inicializa();
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
            img.alt = `${elem.getName()}`;
            img.className = 'domAlly';

            div.appendChild(img);
            this.DOMAllies.appendChild(div);
            this.DOMAlliesArray.push(elem);
        }
    }

    preload(){
        this.load.image('pimiento', 'assets/pimiento.png');
        this.load.image('tortuga','assets/tortuga.png');
        this.load.image('chupacabra','assets/Chupacabra.png');
        this.load.image('perro','assets/Dog.png');
        this.load.image('foca','assets/Seal.png');
        this.load.image('warf','assets/Warf.png');
    }

    inicializa(){
        this.allies = [
            new GlobalAlly("pimiento", 'pimiento',36,0,20,0,0,true),
            new GlobalAlly("tortuga",'tortuga' ,20,0,5,0,0,true),
            new GlobalAlly("chupacabra",'chupacabra',21,0,10,0,0,true),
            new GlobalAlly("perro",'perro',36,0,20,0,0,true),
            new GlobalAlly("foca",'foca',36,0,20,0,0,true),
            new GlobalAlly("warf",'warf',35,0,7,0,0,true)
        ];//nombre, textura,vida,rango, ataque,nivel, coste, avaible,
        
        //Cuando esté la tienda hecha habrá que cambiar esto

        this.allies.forEach(x => {
            this.addAlly(x);
        });
    }
}
