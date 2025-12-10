class Node {

    constructor(value = null, parent = null, active = false) {
        //Valor del nodo
        this.value = value;
        //Indica si el botón del nodo está activo
        this.active = active;
        //Array de hijos
        this.children = [];
        //Padres del nodo
        this.parents = [];
        if(parent) this.parents.push(parent);
    }
}

export default class HierarchyGraph {

    constructor(numLevels, childrenPerNode) {
        //Número total de niveles del árbol
        this.levels = numLevels;
        // La raiz siempre es tienda
        this.root = new Node(1, null, true);
        //Array bidimensional, que guardará los nodos por niveles (filas)
        this.levelMatrix = new Array(this.levels);
        for(let i = 0; i < this.levels; i++) {
            this.levelMatrix[i] = [];
        }
        this.levelMatrix[0].push(this.root);
        //Número total de nodos del árbol
        this.numNodes = 1;
        //Array con los nodos con hijos compartidos
        this.redundantNodes = new Set();
        //Nivel en el que los nodos empiezan a converger (Nota: la divergencia y convergencia son cíclcicas)
        this.convergence = Math.floor(this.levels / 2); 
        //Hijos por nodo durante una fase de divergencia
        this.childrenPerNode = childrenPerNode;
        const level = 0;
        this.buildGraph(level, this.getParentPairs(level));
        const lastNode = this.levelMatrix[this.levels - 1][0];
        lastNode.value = 2;
    }

    buildGraph(level, parentPairs) {
        if(level + 1 === this.levels) {
            return;
        }
        
        if(level % (this.convergence * 2) < this.convergence) {
            const parents = this.levelMatrix[level];

            for(let i = 0; i < parents.length; i++) {
                const actual = parents[i];
                
                for(let j = 0; j < this.childrenPerNode; j++) {
                    const value = Math.floor(Math.random() * 2);
                    const node = new Node(value, actual);
                    
                    actual.children.push(node);
                    this.levelMatrix[level + 1].push(node);
                    this.numNodes++;
                }
            }
        }
        else {
            for(let i = 0; i < parentPairs.length; i++) {
                const actual = parentPairs[i];
                    
                const value = Math.floor(Math.random() * 2);
                const node = new Node(value, actual[0]);
                
                this.levelMatrix[level + 1].push(node);
                this.numNodes++;

                actual.forEach(x => {
                    x.children.push(node);
                });

                node.parents.push(actual[1]);
            }
        }
        
        this.buildGraph(level + 1, this.getParentPairs(level + 1));
    }

    getParentPairs(level) {
        let count = 0;
        const res = []
        res[count] = [];
        for(let i = 0; i < this.levelMatrix[level].length; i++) {
            const node = this.levelMatrix[level][i];
            if(node !== null) {
                if(res[count].length < 2) {
                    res[count].push(node);
                }
                else {
                    count++;
                    res[count] = [node];
                }
            }
        }
        return res;
    }
}