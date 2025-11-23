import Ally from "../../gameObjects/characters/ally.js";
import Enemy from "../../gameObjects/characters/enemy.js";
import BinTree from "../managers/binTree.js";

export default class debugMap extends Phaser.Scene {
    constructor() {
        super({key: 'debugMap'});
        //Array con los aliados obtenidos
        this.ownedAllies = [];
        this.money = 0;
        this.buttons = [];
        this.tree = new BinTree(5);
        this.tree.debug();
    }

    //En init le pasamos los aliados y el dinero que tiene el jugador para que cuando entre en una sala se lo pueda pasar a la siguiente escena
    init(data) {
        this.ownedAllies = data.ownedAllies;
        this.money = data.money;
    }

    preload() {
        this.load.image('background','assets/background.jpg');
        this.load.image('combatButton','assets/combat_button.jpg');
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
        button.setScale(0.15);

        //let y = (this.sys.game.canvas.height / this.tree.levels) * this.mirrorLevel(node.level) - 50;
        //let x = (this.sys.game.canvas.width / maxNodes) * it;
        let x = (this.sys.game.canvas.width /  this.tree.levels) * node.level * 0.8;
        let y = (this.sys.game.canvas.height / maxNodes) * it;

        button.setPosition(x, y);

        if(node.value === 0) {
            button.on('pointerdown', () =>{        
                this.scene.start('combatSetup',{
                    ownedAllies: this.ownedAllies,
                    money: this.money
                });
                console.log("Saliendo del mapa");
            });
        }
        else if (node.value === 1) {
            button.on('pointerdown', () =>{        
                this.scene.start('debugMarket',{
                    ownedAllies: this.ownedAllies,
                    money: this.money
                });
                console.log("Saliendo del mapa");
            });
        }
        this.buttons.push(button);

        this.buttonsRec(node.left, maxNodes, this.nextIt(it, maxNodes, true));
        this.buttonsRec(node.right, maxNodes, this.nextIt(it, maxNodes, false));
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
}