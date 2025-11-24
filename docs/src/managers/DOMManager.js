import GlobalAlly from "../managers/globalAlly.js";
import GlobalObject from "../managers/globalObjects.js";
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

        this.DOMObjects = document.getElementById('objectsArray');
        this.DOMObjectsArray =[];
        this.objects =[];

        //Esta parte es provisional hasta que se tengan el resto de componentes del juego
        this.inicializa();
    }

    getArray() {
        return this.DOMAlliesArray;
    }

    getObjectArray(){
        return this.DOMObjectsArray;
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

    addObj(obj){
        let elem = this.objects.find(x => obj.getName() === x.getName());
        if(elem != undefined) {
            const div = document.createElement('div');
            const img = document.createElement('img');

            img.src = elem.getTextureURL();
            img.alt = `${elem.getName()}`;
            img.className = 'domObj';
            img.dataset.objectId = elem.getName(); //para indetificar el objeto
            img.dataset.life = elem.getLife();
            img.dataset.attack = elem.getAttack();

            div.appendChild(img);
            this.DOMObjects.appendChild(div);
            this.DOMObjectsArray.push(elem);
        }
    }

    //inicializa los allies disponibles para la preparación de las tropas aliadas
    inicializa(){
        this.allies = [
            new GlobalAlly("pimiento", 'assets/placeholders/warriors/pimiento.png',36,0,20,0,0,true),
            new GlobalAlly("tortuga",'assets/placeholders/warriors/tortuga.png' ,20,0,5,0,0,true),
            new GlobalAlly("chupacabra",'assets/placeholders/warriors/Chupacabra.png',21,0,10,0,0,true),
            new GlobalAlly("perro",'assets/placeholders/warriors/Dog.png',36,0,20,0,0,true),
            new GlobalAlly("foca",'assets/placeholders/warriors/Seal.png',36,0,20,0,0,true),
            new GlobalAlly("warf",'assets/placeholders/warriors/Warf.png',35,0,7,0,0,true)
        ];//nombre, textura,vida,rango, ataque,nivel, coste, avaible,
        
        this.objects =[
            new GlobalObject(this, 0,0,"Viejo calcetín", '', 0, 3, 5, 0),
            new GlobalObject(this, 0,0,"Agua", '', 2, 2, 5, 0)
        ]
        //Cuando esté la tienda hecha habrá que cambiar esto

        this.allies.forEach(x => {
            this.addAlly(x);
        });

        this.objects.forEach(x => {
            this.addObj(x);
        });
    }

    //para remover el objeto despues de usarlo
    removeObject(objectName) {
        const objectIndex = this.DOMObjectsArray.findIndex(obj => obj.getName() === objectName);
        if (objectIndex !== -1) {
            this.DOMObjectsArray.splice(objectIndex, 1);
        }
        
        // Remover del DOM
        const objectElement = this.DOMObjects.querySelector(`[data-object-id="${objectName}"]`);
        if (objectElement && objectElement.parentNode) {
            objectElement.parentNode.remove();
        }
    }
}
