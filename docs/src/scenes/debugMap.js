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
        this.tree = new BinTree(3);
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
        let pos_x = this.sys.game.canvas.width;
        let pos_y = this.sys.game.canvas.height;

        this.buttonsRec(this.tree.root, pos_x, pos_y);
    }

    buttonsRec(node, x, y, left = null) {
        if(node.empty()) return;
        //const button = this.add.image(100, 50, 'combatButton').setInteractive();

        if(node === this.tree.root) {
            const button = this.add.image(100, 50, 'combatButton').setInteractive();

            x /= 2;
            y *= 0.8;
            button.setPosition(x, y);
        }
        else {
            /*
            left ? x /= 2 : x *= 1.5;
            y = (node.level / this.tree.levels) * this.sys.game.canvas.height;
            button.setPosition(x, y);
            */
        }

        button.on('pointerdown', () =>{        
            this.scene.start('combatSetup',{
                ownedAllies: this.ownedAllies,
                money: this.money
            });
            console.log("Saliendo del mapa");
        });
        this.buttons.push(button);

        this.buttonsRec(node.left, x, y, true);
        this.buttonsRec(node.right, x, y, false);
    }

}