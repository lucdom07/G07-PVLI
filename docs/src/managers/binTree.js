

class Node {
    // Nodo padre
    father;
    // Valor del nodo
    value;
    // Nivel del nodo
    level;
    // Hijo izquierdo 
    left;
    // Hijo derecho
    right;

    constructor(value = null, level = null, father = null) {
        this.value = value;
        this.level = level;
        this.father = father;
        this.left = null;
        this.right = null;
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
        this.root = new Node(1, i);
        this.numNodes = 1;
        this.levels = numLevels;
        this.buildTree(this.root, numLevels, i);
    }

    buildTree(father, numLevels, it) {
        it++;
        if(it > numLevels) {
            father.left = new Node();
            father.right = new Node();
            return;
        }
        
        let val = 0
        
        father.left = new Node(val, it, father);
        this.buildTree(father.left, numLevels, it);
        
        //val = 0;

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