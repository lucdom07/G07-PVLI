

class Node {
    // Nodo padre
    father;
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

    constructor(value = null, level = null, father = null, active = false) {
        this.value = value;
        this.level = level;
        this.father = father;
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

    buildTree(father, numLevels, it) {
        it++;
        if(it > numLevels) {
            father.left = new Node(null, null, father);
            father.right = new Node(null, null, father);
            return;
        }
        
        //let val = Math.floor(Math.random() * 2);
        let val = 1;
        
        father.left = new Node(val, it, father);
        this.buildTree(father.left, numLevels, it);
        
        //val = Math.floor(Math.random() * 2);
        val = 0;

        father.right = new Node(val, it, father);
        this.buildTree(father.right, numLevels, it);

        this.numNodes += 2;
    }

    debug() {
        console.log(this.root.value);
        console.log(this.root.left.value);
        console.log(this.root.right.value);
    }
}