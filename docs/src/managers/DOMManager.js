
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

    /*
    Añade un DomAlly a DOMAllies
    */
    addDomAlly(ally) {
        if(![this.DOMallies].some(x => ally.name === x.dataset.name)) {
            const div = document.createElement('div');
            const img = document.createElement('img');

            div.dataset.name = ally.name;
            img.src = 'assets/placeholders/warriors/' + ally.name + '.png';
            img.className = 'domAlly';

            div.appendChild(img);
            this.DOMallies.appendChild(div);
        }
    }

    //Elimina un aliado del DOM
    removeDomAlly(ally) {
        let elem = [this.DOMallies].find(x => ally.name === x.dataset.name);
        if(elem) {
            this.DOMallies.removeChild(elem);
        }
    }

    //inicializa los allies disponibles para la preparación de las tropas aliadas
    inicializa(allies) {
        this.ownedAllies = allies;
        //Cuando esté la tienda hecha habrá que cambiar esto

        this.ownedAllies.forEach(x => {
            this.addDomAlly(x);
        });

    }


}
