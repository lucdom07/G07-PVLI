/**
 * Clase Nodo, que usa la clase HierarchyGraph para hacer sus nodos
 */
class Node {

    constructor(value = null, parent = null, textures, active = false) {
        //Valor del nodo
        this.value = value;
        //Array de hijos
        this.children = [];
        //Padres del nodo
        this.parents = [];
        if(parent) this.parents.push(parent);
        //Botón asociado al nodo
        this.button = null;
        //Indica si el botón del nodo está activo
        this.active = active;
        //Array con las dos posibles texturas del botón asociado al nodo (textura de botón activo e inactivo)
        this.textures = textures || [2];
    }

    /**
     * Activa o desactiva el nodo (su atributo .active) y cambia la textura del botón asociado acorde al nuevo estado del nodo
     * @param {Bool} state - Nuevo estado (.active) del nodo
     */
    setActiveState(state) {
        if(!this.textures[0] || !this.textures[1] || !this.button) return;
        
        this.active = state;
        if(this.active) {
            this.button.setTexture(this.textures[1]);
        }
        else {
            this.button.setTexture(this.textures[0]);
        }
    }
}

/**
 * Clase que consiste en un grafo con fases de divergencia y convergencia, donde los nodos están jerarquizados en padres e hijos
 */
export default class HierarchyGraph {

    constructor(numLevels, childrenPerNode) {
        //Número total de niveles del árbol
        this.levels = numLevels;
        // La raiz siempre es tienda
        this.root = new Node(1, null, ['market', 'marketH'], true);
        //Array bidimensional, que guardará los nodos por niveles (filas)
        this.levelMatrix = new Array(this.levels);
        for(let i = 0; i < this.levels; i++) {
            this.levelMatrix[i] = [];
        }
        this.levelMatrix[0].push(this.root);
        //Número total de nodos del árbol
        this.numNodes = 1;
        //Nivel en el que los nodos empiezan a converger (Nota: la divergencia y convergencia son cíclcicas)
        this.convergence = Math.floor(this.levels / 2); 
        //Hijos por nodo durante una fase de divergencia
        this.childrenPerNode = childrenPerNode;
        const level = 0;
        this.buildGraph(level, this.getParentPairs(level));
        //El último nodo siempre es el boss
        const lastNode = this.levelMatrix[this.levels - 1][0];
        lastNode.value = 2;
    }

    /**
     * Función recursiva que construye el grafo. Es llamada por el constructor.
     * Cada iteración de la recursión construye un nivel completo del grafo
     * 
     * La función comprende una fase de divergencia, en la que cada nodo tendrá una cantidad de hijos igual al atributo .childrenPerNode;
     * y otra fase de convergencia en la que se obtendrán pares de nodos que compartirán un solo hijo (cada nodo tiene un solo hijo en esta fase)
     * @param {int} level - Nivel que está siendo construido en la iteración actual
     * @param {[[Node, Node]]} parentPairs - Array de pares de nodos que comparten hijo en una fase de convergencia
     * @returns 
     */
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

    /**
     * Obtiene el array de pares de padres que compartirán hijo en un nivel
     * @param {int} level - Nivel del que se quiere obtener el array
     * @returns Array de pares de nodos que comparten hijo
     */
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