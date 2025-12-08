

class Node {

    constructor(value = null, level = null, parent = null, active = false) {
        //Valor del nodo
        this.value = value;
        //Nivel del nodo
        this.level = level;
        //Padres del nodo
        this.parents = []
        if(parent) this.parents.push(parent);
        //Indica si el botón del nodo está activo
        this.active = active;
        //Array de hijos
        this.children = [];
    }

    empty() {
        return this.value === null;
    }
}

export default class Tree {

    constructor(numLevels) {
        const i = 1;
        // La raiz siempre es tienda
        this.root = new Node(1, i, null, true);
        //Número total de nodos del árbol
        this.numNodes = 1;
        //Número total de niveles del árbol
        this.levels = numLevels;
        this.buildTree(this.root, i);
    }

    /**
     * Función recursiva que construye el árbol, empieza en el nivel 1, haciendo dos nodos hijos por cada nodo, a partir del nivel 4
     * empezará a crear un nodo por cada dos nodos (los nodos padres serán los dos más cercanos entre sí del nivel anterior al hijo)
     * @param {Node} actual - Nodo actual, al que se le van a crear los hijos en la iteración
     * @param {int} level - Nivel actual, en el que se encuentra el nodo actual
     */
    buildTree(actual, level) {
        console.log("a\n");
        if(level > this.levels) {
            actual.children = [new Node(null, null, actual)];
            return;
        }
        
        if(level <= 3) {
            for(let i = 0; i < 2; i++) {
                const val = Math.floor(Math.random() * 2);
                
                actual.children.push(new Node(val, level + 1, actual));
                this.buildTree(actual.children[i], level + 1);
                this.numNodes++;
            }
        }
        else {
            const val = Math.floor(Math.random() * 2);
            const  node = new Node(val, level + 1);
            
            const up_parent = actual.parents[0];

            for(let i = 0; i < up_parent.children.length; i++) {
                const parent_node = up_parent.children[i];
                parent_node.children.push(node);
                node.parents.push(parent_node);
            }

            this.buildTree(node, level + 1);
            this.numNodes++;
        }
    }
}