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

    createButtons() {
        let max_nodes = Math.pow(3, this.tree.levels);
        let div = Math.floor(max_nodes / 2);
        this.buttonsRec(this.tree.root, max_nodes, div);
    }
    
    buttonsRec(node, maxNodes, it) {
        if(node.empty()) return;
        const button = this.add.image(100, 50, 'combatButton').setInteractive();
        button.setScale(0.35);

        //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
        //let x = (this.sys.game.canvas.width / maxNodes) * it;
        let x = (this.sys.game.canvas.width /  this.tree.levels) * node.level * 0.8;
        let y = (this.sys.game.canvas.height / maxNodes) * it;

        button.setPosition(x, y);
        node.button = button;
        
        this.buttonsRec(node.left, maxNodes, this.nextIt(it, maxNodes, true));
        this.buttonsRec(node.right, maxNodes, this.nextIt(it, maxNodes, false));
        
        let key;

        if(node.value === 0) {
            key = 'combatSetup';
        }
        else {
            key = 'debugMarket';
        }
        
        button.on('pointerdown', () =>{     
            if(node.active) {
                this.scene.start(key, {
                    ownedAllies: this.ownedAllies,
                    money: this.money
                });
                console.log("Saliendo del mapa");
                this.enableButtons(node);
            }   
        });

    }

    mirrorLevel(level) {
        return this.tree.levels - level + 1; 
    }

    nextIt(it, maxNodes, left) {
        if(left) {
            return Math.floor((maxNodes + it) / 2); 
        }
        else {
            return Math.floor((maxNodes - it) / 2);
        }
    }

    enableButtons(node) {
        node.active = false;
        if(!node.left.empty()) node.left.active = true;
        if(!node.right.empty()) node.right.active = true;
                
        if(node.father != null) {
            if(node === node.father.left) {
                node.father.right.active = false;
            }
            else if(node === node.father.right) {
                node.father.left.active = false;
            }
        }
    }
}