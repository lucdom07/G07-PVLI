

class Node {
    // Valor del nodo
    value;
    // Nivel del nodo
    level;
    // Hijo izquierdo 
    left;
    // Hijo derecho
    right;

    constructor(value, level) {
        this.value = value;
        this.level = level;
        this.left = null;
        this.right = null;
    }

    empty() {
        return this.value == null;
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
        this.root = new Node(-1, 0);
        this.numNodes = 1;
        this.levels = numLevels;
        let i = 1;
        this.buildTree(this.root, numLevels, i);
    }

    buildTree(father, numLevels, it) {
        if(it >= numLevels) return;
        it++;
        
        let val = 1
        
        father.left = new Node(val, it);
        this.buildTree(father.left, numLevels, it);
        
        val = 0;

        father.right = new Node(val, it);
        this.buildTree(father.right, numLevels, it);

        this.numNodes += 2;
    }

    debug() {
        console.log(this.root.value);
        console.log(this.root.left.value);
        console.log(this.root.right.value);
    }
}