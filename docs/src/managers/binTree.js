

class Node {
    // Nodo padre
    parent;
    // Valor del nodo
    value;
    // Nivel del nodo
    level;
    // Indica si se puede pulsar
    active;
    // Hijo izquierdo 
    left;
    // Hijo derecho
    right;
    // Botón
    button;

    constructor(value = null, level = null, parent = null, active = false) {
        this.value = value;
        this.level = level;
        this.parent = parent;
        this.active = active;
        this.left = null;
        this.right = null;
        this.button = null;
    }

    empty() {
        return this.value === null;
    }
}

export default class BinTree {
    // Raíz del árbol
    root;
    // Número de nodos
    numNodes;
    // Número de niveles
    levels;

    constructor(numLevels) {
        let i = 1;
        // La raiz siempre es tienda
        this.root = new Node(1, i, null, true);
        this.numNodes = 1;
        this.levels = numLevels;
        this.buildTree(this.root, numLevels, i);
    }

    buildTree(parent, numLevels, it) {
        it++;
        if(it > numLevels) {
            parent.left = new Node(null, null, parent);
            parent.right = new Node(null, null, parent);
            return;
        }
        
        let val = Math.floor(Math.random() * 2);
        //let val = 1;
        
        parent.left = new Node(val, it, parent);
        this.buildTree(parent.left, numLevels, it);
        
        val = Math.floor(Math.random() * 2);
        //val = 1;

        parent.right = new Node(val, it, parent);
        this.buildTree(parent.right, numLevels, it);

        this.numNodes += 2;
    }
}