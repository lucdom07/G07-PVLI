import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";
import BinTree from "../managers/binTree.js";

export default class debugMap extends Phaser.Scene {
    constructor() {
        super({key: 'debugMap'});
        this.playerData = {}
        this.tree = new BinTree(4);
    }

    //En init le pasamos los aliados y el dinero que tiene el jugador para que cuando entre en una sala se lo pueda pasar a la siguiente escena
    init(data) {
        this.playerData = data;
    }

    preload() {
        this.load.image('background','assets/placeholders/background.jpg');
        this.load.image('combatButton','assets/placeholders/buttons/combat_button.jpg');
    }

    create() {
        this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'background');

        this.createButtons();
    }

    //Función que se llama en create para crear los botones
    createButtons() {
        let divs = Math.pow(3, this.tree.levels);
        let div = Math.trunc(divs / 2);
        this.buttonsRec(this.tree.root, divs, 1, div);
    }
    
    /**
     * Esta función es una recursión que se usa en createButtons para recorrer el arbol binario atributo de esta clase, 
     * y crear un botón por nodo del árbol, que será asignado al nodo correspondiente
     * @param {Node} node - Se le tiene que pasar la raíz del árbol. Es el nodo que está siendo tratado en la iteración actual
     * @param {int} divs - Divisiones horizontales del canvas (1 botón por división en cada nivel del árbol)
     * @param {int} level - Nivel que está siendo tratado en la iteración actual
     * @param {int} it - Iterador que india en qué subdivisión del canvas hay que colocar el botón de la iteración actual
     * @returns {null}
     */
    buttonsRec(node, divs, level, it) {
        if(node.empty()) return;
        const button = this.add.image(100, 50, 'combatButton').setInteractive();
        button.setScale(0.35);

        //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
        //let x = (this.sys.game.canvas.width / divs) * it;
        let x = (this.sys.game.canvas.width /  this.tree.levels) * node.level * 0.8;
        let y = (this.sys.game.canvas.height / divs) * it;

        button.setPosition(x, y);
        node.button = button;
        
        let key;
        
        if(node.value === 0) {
            key = 'combatSetup';
        }
        else {
            key = 'debugMarket';
        }
        
        button.on('pointerdown', () =>{     
            if(node.active) {
                this.enableButtons(node);
                this.scene.start(key, this.playerData);
                console.log("Saliendo del mapa");
            }  
        });
        
        level++;
        this.buttonsRec(node.left, divs, level, this.nextIt(it, level, divs)[0]);
        this.buttonsRec(node.right, divs, level, this.nextIt(it, level, divs)[1]);
    }
    
    /**
     * Calcula el siguiente valor de it en la función buttonsRec
     * @param {int} it - it de buttonsRec
     * @param {int} level - level de buttonsRec
     * @param {int} divs - divs de buttonsRec
     * @returns {[int, int]} - lista con los nuevos valores de it para cada hijo del nodo siendo tratado en buttonsRec 
     */
    nextIt(it, level, divs) {
        let nodos = Math.pow(2, level - 1);
        let disp_divs = Math.floor(divs / nodos);
        let inc = Math.floor(disp_divs / 2);
        return [it + inc, it - inc];
    }
    
    /**
     * Función que lleva la lógica arborescente de los botones; es decir, cuales deben ser pulsables y cuales no
     * @param {Node} node - nodo que contiene el botón que está siendo pulsado
     */
    enableButtons(node) {
        if(!node.right.empty()) node.right.active = true;
        if(!node.left.empty()) node.left.active = true;
        
        if(node.parent !== null) {
            if(node === node.parent.left) {
                node.parent.right.active = false;
            }
            else if(node === node.parent.right) {
                node.parent.left.active = false;
            }
        }
        node.active = false;
    }
    
    //Solo se usa si queremos poner el árbol en vertical
    mirrorLevel(level) {
        return this.tree.levels - level + 1; 
    }
}