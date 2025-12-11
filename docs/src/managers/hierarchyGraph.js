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
     * @param {boolean} state - Nuevo estado (.active) del nodo
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
        this.buildGraph(level, this.getParentGroups(level));
        //El último nodo siempre es el boss
        const lastNode = this.levelMatrix[this.levels - 1][0];
        lastNode.value = 2;
    }

    /**
     * Función recursiva que construye el grafo. Es llamada por el constructor.
     * Cada iteración de la recursión construye un nivel completo del grafo
     * 
     * La función comprende una fase de divergencia, en la que cada nodo tendrá una cantidad de hijos igual al atributo .childrenPerNode;
     * y otra fase de convergencia en la que se obtendrán grupos de nodos de tamaño igual al número de hijso por nodo en la fase de divergencia
     * que compartirán un solo hijo (cada nodo tiene un solo hijo en esta fase)
     * @param {number} level - Nivel que está siendo construido en la iteración actual
     * @param {Node[][]} parentGroups - Array de grupos de nodos de tamaño igual .childrenPerNode, que comparten hijo en una fase de convergencia
     * @returns 
     */
    buildGraph(level, parentGroups) {
        if(level + 1 === this.levels) {
            return;
        }

        let markets = 0;
        let combats = 0;
        if(level % (this.convergence * 2) < this.convergence) {
            const parents = this.levelMatrix[level];

            for(let i = 0; i < parents.length; i++) {
                const actual = parents[i];
                
                for(let j = 0; j < this.childrenPerNode; j++) {

                    const value = this.makeValue(parents.length, j + 1, markets, combats, false);
                    if(value == 0) combats++;
                    else if(value == 1) markets++;
                    const node = new Node(value, actual);
                    
                    actual.children.push(node);
                    this.levelMatrix[level + 1].push(node);
                    this.numNodes++;
                }
            }
        }
        else {
            for(let i = 0; i < parentGroups.length; i++) {
                const actual = parentGroups[i];
                    
                const value = this.makeValue(parentGroups.length * this.childrenPerNode, i + 1, markets, combats, true);
                const node = new Node(value);
                
                this.levelMatrix[level + 1].push(node);
                this.numNodes++;

                actual.forEach(x => {
                    x.children.push(node);
                    node.parents.push(x);
                });
            }
        }
        
        this.buildGraph(level + 1, this.getParentGroups(level + 1));
    }

    /**
     * Obtiene el array de arrays de nodos que compartirán hijo en un nivel
     * @param {number} level - Nivel del que se quiere obtener el array
     * @returns Array de grupos de nodos que comparten hijo
     */
    getParentGroups(level) {
        let count = 0;
        const res = []
        res[count] = [];
        for(let i = 0; i < this.levelMatrix[level].length; i++) {
            const node = this.levelMatrix[level][i];
            if(node !== null) {
                if(res[count].length < this.childrenPerNode) {
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

    /**
     * Función que crea un valor aleatorio entre 0 y 1, controlando hasta cierto punto la aleatoriedad para que no salgan
     * grafos muy desbalanceados
     * @param {number} nodesInLevel - Número de nodos en el nivel del nodo cuyo valor se está calculando
     * @param {number} node - Número en el nivel, del nodo al que se le está dando valor (p.ej. primer nodo, segundo, etc del nivel)
     * @param {number} markets - Número de tiendas creadas hasta ahora en el nivel (nodos con valor 1)
     * @param {number} combats  - Número de salas de combate creadas hasta ahora en el nivel (nodos con valor 0)
     * @param {boolean} convergence - Indica si el nivel al que pertenece el nodo es uno de comvergencia (true) o divergencia (false)
     * @returns valor "aleatorio" entre 0 y 1
     */
    makeValue(nodesInLevel, node, markets, combats, convergence) {
        if(convergence) {
            nodesInLevel *= this.childrenPerNode;
        }

        let value = Math.floor(Math.random() * 2);
        if(value === 1 && markets > ((nodesInLevel / 2) + 1)) {
            //Las tiendas tienen que ser mas escasas que los combates, por eso sus condiciones son más restrictivas
            value = 0;
        }
        else if(value == 0 && combats > (nodesInLevel / 2)) {
            value = 1;
        }

        if(node === nodesInLevel && markets === 0) {
            value = 1;
        }

        return value;
    }

}