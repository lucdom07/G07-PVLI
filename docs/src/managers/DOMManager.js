
/*
    Esta clase está destinada a controlar el DOM en tiempo de ejecución
*/
export default class DOMmanager {

    constructor() {
        //División del DOM que muestra los aliados desbloqueados (también de clase DomAlly)
        this.DOMallies = document.getElementById('alliesArray');
        //Array con los aliados obtenidos por el jugador
        this.ownedAllies = [];
    }

    /**
     * Función que añade un aliado al DOM, creando una div, con un atributo del dataset que guarda el nombre del aliado
     * y una imagen con la textura de este
     * @param {Ally} ally - Aliado que se quiere añadir al DOM
     */
    addDomAlly(ally) {
        if(![...this.DOMallies.children].some(x => ally.name === x.dataset.name)) {
            const div = document.createElement('div');
            const img = document.createElement('img');

            div.dataset.name = ally.name;
            img.src = ally.textureURL;
            img.className = 'domAlly';

            div.appendChild(img);
            this.DOMallies.appendChild(div);
        }
    }

    /**
     * Elimina un aliado del DOM (la div creada con this.addDomAlly)
     * @param {Ally} ally - Aliado que se quiere quitar del DOM
     */
    removeDomAlly(ally) {
        let elem = [...this.DOMallies.children].find(x => ally.name === x.dataset.name);
        if(elem) {
            this.DOMallies.removeChild(elem);
        }
    }

    /**
     * Añade al DOM todos los aliados del array de ownedAllies de esta clase, que no hubieran sido añadidos antes
     */
    updateAllies() {
        this.ownedAllies.forEach(x => {
            console.log(x.name);
            if(![...this.DOMallies.children].some(y => y.dataset.name === x.name))
                this.addDomAlly(x);
        });

    }

    /**
     * Elimina todas las divs de aliados del DOM
     */
    destroyDomAllies() {
        this.ownedAllies.forEach(ally => {
            this.removeDomAlly(ally);
        });
    }

    /**
     * Asocia por referencia la lista ownedAllies de esta clase con la que se le pase por parámetro, 
     * y actualiza el DOM para que incluya los aliados de la nueva lista.
     * Sirve para incializar el DOMmanager y debe ser llamado por una clase externa (en este caso, el menú)
     * @param {Ally[]} allies - Array que referencia el array de aliados obtenidos de esta clase
     */
    inicializa(allies) {
        this.ownedAllies = allies;
        //Cuando esté la tienda hecha habrá que cambiar esto

        this.updateAllies();
    }

}
